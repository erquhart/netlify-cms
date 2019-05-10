import { NetlifyCmsApp as CMS } from 'netlify-cms-app/dist/esm';

// Media libraries
import uploadcare from 'netlify-cms-media-library-uploadcare';
import cloudinary from 'netlify-cms-media-library-cloudinary';

// Code widget and default Codemirror extensions
import NetlifyCmsWidgetCode from 'netlify-cms-widget-code';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';

CMS.registerMediaLibrary(uploadcare);
CMS.registerMediaLibrary(cloudinary);
CMS.registerWidget([
  NetlifyCmsWidgetCode.Widget(),
]);
CMS.registerEditorComponent({
  id: 'code-block',
  label: 'Code Block',
  widget: 'code',
  type: 'code-block',
});
