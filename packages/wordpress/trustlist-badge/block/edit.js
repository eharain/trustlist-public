/* TrustList Badge block: settings in the sidebar, preview rendered by the server (no build step). */
(function (wp) {
  var el = wp.element.createElement;
  var __ = wp.i18n.__;
  var InspectorControls = wp.blockEditor.InspectorControls;
  var useBlockProps = wp.blockEditor.useBlockProps;
  var PanelBody = wp.components.PanelBody;
  var TextControl = wp.components.TextControl;
  var SelectControl = wp.components.SelectControl;
  var ServerSideRender = wp.serverSideRender;

  wp.blocks.registerBlockType('trustlist/badge', {
    edit: function (props) {
      var a = props.attributes;
      var set = function (key) {
        return function (value) {
          var next = {};
          next[key] = value;
          props.setAttributes(next);
        };
      };
      return el('div', useBlockProps(),
        el(InspectorControls, null,
          el(PanelBody, { title: __('Badge', 'trustlist-badge') },
            el(TextControl, { label: __('Ranking address (starts with /best/)', 'trustlist-badge'), value: a.page, onChange: set('page') }),
            el(TextControl, { label: __('Link text', 'trustlist-badge'), help: __('For example: TrustList: Top Web Design Agencies in London', 'trustlist-badge'), value: a.label, onChange: set('label') }),
            el(SelectControl, {
              label: __('Size', 'trustlist-badge'), value: a.size || 'regular', onChange: set('size'),
              options: [{ label: __('Regular', 'trustlist-badge'), value: 'regular' }, { label: __('Small', 'trustlist-badge'), value: 'small' }]
            }),
            el(TextControl, { label: __('Listing slug (leave empty to use the one in Settings)', 'trustlist-badge'), value: a.slug, onChange: set('slug') }),
            el(TextControl, { label: __('Edition (optional, e.g. 2026-Q4)', 'trustlist-badge'), value: a.edition, onChange: set('edition') })
          )
        ),
        a.page
          ? el(ServerSideRender, { block: 'trustlist/badge', attributes: a })
          : el('p', null, __('Enter the ranking address in the block settings to show your TrustList badge.', 'trustlist-badge'))
      );
    },
    save: function () {
      return null;
    }
  });
})(window.wp);
