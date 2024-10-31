import { registerBlockType } from "@wordpress/blocks";
import {
  SelectControl,
  Placeholder,
  Panel,
  PanelBody,
} from "@wordpress/components";
import {
  InspectorControls,
  InnerBlocks,
  useBlockProps,
} from "@wordpress/block-editor";
import { withSelect } from "@wordpress/data";

registerBlockType("embed-other-post/main", {
  title: "Embed Other Post",
  icon: "admin-post",
  category: "common",
  supports: {
    innerBlocks: true,
  },
  attributes: {
    selectedPostId: {
      type: "number",
    },
  },

  edit: withSelect((select, props) => {
    const { selectedPostId } = props.attributes;
    return {
      posts: select("core").getEntityRecords("postType", "post", {
        per_page: -1,
      }),
      selectedPost: selectedPostId
        ? select("core").getEntityRecord("postType", "post", selectedPostId)
        : null,
    };
  })((props) => {
    const { attributes, setAttributes, posts, selectedPost } = props;
    const { selectedPostId } = attributes;
    const blockProps = useBlockProps();

    if (!posts) {
      return <Placeholder>Loading...</Placeholder>;
    }

    const postOptions = posts.map((post) => ({
      label: post.title.rendered,
      value: post.id,
    }));

    // Set up the context provider for inner blocks
    const innerBlocksProps = {
      value: {
        postId: selectedPostId,
        postType: "post",
      },
    };

    return (
      <div {...blockProps}>
        <InspectorControls>
          <Panel>
            <PanelBody title="Post Settings">
              <SelectControl
                label="Select Post"
                value={selectedPostId}
                options={[
                  { label: "Select a post...", value: "" },
                  ...postOptions,
                ]}
                onChange={(value) =>
                  setAttributes({
                    selectedPostId: parseInt(value),
                  })
                }
              />
            </PanelBody>
          </Panel>
        </InspectorControls>
        <div className="embed-other-post-block">
          {!selectedPostId ? (
            <Placeholder>Please select a post to embed</Placeholder>
          ) : (
            <div data-post-id={selectedPostId}>
              <InnerBlocks
                context={innerBlocksProps.value}
                allowedBlocks={[
                  "core/post-title",
                  "core/post-content",
                  "core/post-excerpt",
                ]}
                template={[["core/post-title"], ["core/post-content"]]}
              />
            </div>
          )}
        </div>
      </div>
    );
  }),

  save: function () {
    return <InnerBlocks.Content />;
  },
});
