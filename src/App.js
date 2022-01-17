import './App.css';
import { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';

// https://www.pdftron.com/documentation/web/guides/forms/apis/
// https://www.pdftron.com/documentation/web/guides/full-api/
function App() {
  const viewerDiv = useRef(null)
  const [controller,setController] = useState({
    /* ===== ACTIONS - Programmatically ===== */
      selectToolbarGroupForms: ()=>{},
    /* ===== LEFT SIDEBAR - Insertions ===== */
      insertTextField: ()=>{},
      insertCheckboxField: ()=>{},
      insertRadioField: ()=>{},
      insertDropdownField: ()=>{},
      insertSignatureField: ()=>{},
    /* ===== RIGHT SIDEBAR - Page manipulation ===== */
      currentPage: 0,
      pageCount: 0,
      goToPage: ()=>{},
    /* ===== RIGHT SIDEBAR - Element Selection ===== */
      selectedElements: [],
      deleteField: ()=>{},
  })
  const [pages,setPages] = useState([])
  useEffect(()=>{
    WebViewer(
      {
        path: 'lib',
        initialDoc: '/files/PDFTRON_about.pdf',
      },
      viewerDiv.current
    ).then((instance)=>{
      const { documentViewer, annotationManager, Annotations } = instance.Core;
      console.log('instance.UI',instance.UI)
      /* ===== ACTIONS - Programmatically ===== */
        function selectToolbarGroupForms(){
          instance.UI.setToolbarGroup('toolbarGroup-Forms');
        }
        setController(baseController=>({
          ...baseController,
          selectToolbarGroupForms: selectToolbarGroupForms
        }));
      /* ===== ACTIONS - Programmatically ===== */

      /* ===== LEFT SIDEBAR - Insertions ===== */
        function insertProgrammaticallyTextField(){
          // set flags for multiline and required
          const flags = new Annotations.WidgetFlags();
          // flags.set('Multiline', true);
          flags.set('Required', true);
          flags.set('Edit', true);

          // set font type
          const font = new Annotations.Font({ name: 'Helvetica' });

          // create a form field
          const field = new Annotations.Forms.Field("some text field name", {
            type: 'Tx',
            // defaultValue: "some placeholder default text value",
            value: "Text",
            flags,
            font,
          });

          // create a widget annotation
          const widgetAnnot = new Annotations.TextWidgetAnnotation(field)

          // set position and size
          widgetAnnot.PageNumber = 1;
          widgetAnnot.X = 100;
          widgetAnnot.Y = 100;
          widgetAnnot.Width = 50;
          widgetAnnot.Height = 20;

          //add the form field and widget annotation
          annotationManager.addAnnotation(widgetAnnot);
          annotationManager.drawAnnotationsFromList([widgetAnnot]);
          annotationManager.getFieldManager().addField(field);
        }
        setController(baseController=>({
          ...baseController,
          insertTextField: insertProgrammaticallyTextField
        }));
        function insertProgrammaticallyCheckboxField(){
          // set flags for required and edit
          const flags = new Annotations.WidgetFlags();
          flags.set('Required', true);
          flags.set('Edit', true);
      
          // set font type
          const font = new Annotations.Font({ name: 'Helvetica' });
      
          // create a form field
          // https://www.pdftron.com/api/web/Core.Annotations.Forms.Field.html
          const field = new Annotations.Forms.Field("some checkbox field name", {
            type: 'Btn',
            value: 'On',
            flags,
            font,
          });

          console.log('field',field)
          console.log('field.flags',field.flags)
          console.log('flags',flags)
      
          // create a widget annotation
          // https://www.pdftron.com/api/web/Core.Annotations.CheckButtonWidgetAnnotation.html#CheckButtonWidgetAnnotation__anchor
          // caption options are:
          // "4" = Tick
          // "l" = Circle
          // "8" = Cross
          // "u" = Diamond
          // "n" = Square
          // "H" = Star
          // "" = Check
          const widgetAnnot = new Annotations.CheckButtonWidgetAnnotation(field, {
            appearance: 'Off',
            appearances: {
              Off: {},
              Yes: {},
            },
            captions: {
              Normal: "" // Check
            }
          });
          console.log('widgetAnnot',widgetAnnot)
          console.log('widgetAnnot.Id',widgetAnnot.Id)
          console.log('widgetAnnot.fieldName',widgetAnnot.fieldName)
      
          // set position and size
          widgetAnnot.PageNumber = 1;
          widgetAnnot.X = 100;
          widgetAnnot.Y = 150;
          widgetAnnot.Width = 20;
          widgetAnnot.Height = 20;
      
          //add the form field and widget annotation
          annotationManager.addAnnotation(widgetAnnot);
          annotationManager.drawAnnotationsFromList([widgetAnnot]);
          annotationManager.getFieldManager().addField(field);
        }
        setController(baseController=>({
          ...baseController,
          insertCheckboxField: insertProgrammaticallyCheckboxField
        }));
        function insertProgrammaticallyRadioField(){
          // set flags for radio and no toggle to off
          const flags = new Annotations.WidgetFlags();
          flags.set(Annotations.WidgetFlags.RADIO, true);

          // optional to keep at least one state active
          flags.set(Annotations.WidgetFlags.NO_TOGGLE_TO_OFF, true);
          flags.set('Required', true); 

          // set font type
          const font = new Annotations.Font({ name: 'Helvetica' });

          // create a form field
          const field = new Annotations.Forms.Field("some radio field group name", {
            type: 'Btn',
            value: 'Off',
            flags: flags,
            font: font,
          });

          // create a widget annotation for the first button
          const widgetAnnot1 = new Annotations.RadioButtonWidgetAnnotation(field, {
            appearance: 'Off',
            appearances: {
              Off: {},
              First: {},
            },
          });

          // create a widget annotation for the second button
          const widgetAnnot2 = new Annotations.RadioButtonWidgetAnnotation(field, {
            appearance: 'Off',
            appearances: {
              Off: {},
              Second: {},
            },
          });

          // set position and size
          widgetAnnot1.PageNumber = 1;
          widgetAnnot1.X = 100;
          widgetAnnot1.Y = 100;
          widgetAnnot1.Width = 50;
          widgetAnnot1.Height = 20;

          // set position and size
          widgetAnnot2.PageNumber = 1;
          widgetAnnot2.X = 150;
          widgetAnnot2.Y = 150;
          widgetAnnot2.Width = 50;
          widgetAnnot2.Height = 20;

          //add the form field and widget annotation
          annotationManager.addAnnotation(widgetAnnot1);
          annotationManager.addAnnotation(widgetAnnot2);
          annotationManager.drawAnnotationsFromList([widgetAnnot1, widgetAnnot2]);
          annotationManager.getFieldManager().addField(field);
        }
        setController(baseController=>({
          ...baseController,
          insertRadioField: insertProgrammaticallyRadioField
        }));
        function insertProgrammaticallyDropdownField(){
          // set flags for combo box
          const flags = new Annotations.WidgetFlags();
          flags.set(Annotations.WidgetFlags.COMBO, true);
          flags.set('Required', true); 

          // create combo options
          const options = [
            {
              value: '1',
              displayValue: 'one'
            },
            {
              value: '2',
              displayValue: 'two'
            }
          ];

          // create a form field
          const field = new Annotations.Forms.Field("some combo box field name", {
            type: 'Ch',
            value: options[0].value,
            flags,
            options
          });

          // create a widget annotation
          const widgetAnnot = new Annotations.ChoiceWidgetAnnotation(field);

          // set position and size
          widgetAnnot.PageNumber = 1;
          widgetAnnot.X = 100;
          widgetAnnot.Y = 100;
          widgetAnnot.Width = 50;
          widgetAnnot.Height = 20;

          //add the form field and widget annotation
          annotationManager.addAnnotation(widgetAnnot);
          annotationManager.drawAnnotationsFromList([widgetAnnot]);
          annotationManager.getFieldManager().addField(field);
        }
        setController(baseController=>({
          ...baseController,
          insertDropdownField: insertProgrammaticallyDropdownField
        }));
        function insertProgrammaticallySignatureField(){
          // set flags for required
          const flags = new Annotations.WidgetFlags();
          flags.set('Required', true);

          // create a form field
          const field = new Annotations.Forms.Field("some signature field name", { 
            type: 'Sig', 
            flags,
          });

          // create a widget annotation
          const widgetAnnot = new Annotations.SignatureWidgetAnnotation(field, {
            appearance: '_DEFAULT',
            appearances: {
              _DEFAULT: {
                Normal: {
                  data:
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC',
                  offset: {
                    x: 100,
                    y: 100,
                  },
                },
              },
            },
          });

          // set position and size
          widgetAnnot.PageNumber = 1;
          widgetAnnot.X = 100;
          widgetAnnot.Y = 100;
          widgetAnnot.Width = 50;
          widgetAnnot.Height = 20;

          //add the form field and widget annotation
          annotationManager.addAnnotation(widgetAnnot);
          annotationManager.drawAnnotationsFromList([widgetAnnot]);
          annotationManager.getFieldManager().addField(field);
        }
        setController(baseController=>({
          ...baseController,
          insertSignatureField: insertProgrammaticallySignatureField
        }));
      /* ===== LEFT SIDEBAR - Insertions ===== */

      /* ===== RIGHT SIDEBAR - Page manipulation ===== */
        documentViewer.addEventListener('documentLoaded', () => {
          const doc = documentViewer.getDocument();
          const currentPage = instance.UI.getCurrentPageNumber()
          const pageCount = instance.UI.getPageCount()
          for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
            doc.loadThumbnailAsync(pageNumber, (thumbnail) => {
              // thumbnail is a HTMLCanvasElement or HTMLImageElement
              setPages(basePages=>([
                ...basePages,
                {
                  thumbnail: thumbnail.toDataURL(),
                  number: pageNumber,
                }
              ]))
            });
          }
          setController(baseController=>({
            ...baseController,
            currentPage,
            pageCount,
          }));
        });
        function setCurrentPageNumber(pageNumber){
          instance.UI.setCurrentPageNumber(pageNumber)
        }
        setController(baseController=>({
          ...baseController,
          goToPage: setCurrentPageNumber
        }));
        documentViewer.addEventListener('visibilityChanged', () => {
          const currentPage = instance.UI.getCurrentPageNumber()
          setController(baseController=>({
            ...baseController,
            currentPage,
          }));
        });
      /* ===== RIGHT SIDEBAR - Page manipulation ===== */

      /* ===== RIGHT SIDEBAR - Element Selection ===== */
        annotationManager.addEventListener('annotationSelected', (annotations, action) => {
          // if (action === 'selected') {
          //   console.log('annotation selection');
          // } else if (action === 'deselected') {
          //   console.log('annotation deselection');
          // }
    
          // console.log('annotation list', annotations);
          const selectedAnnots = annotationManager.getSelectedAnnotations();
          // console.log('selectedAnnots',selectedAnnots);
          selectedAnnots.map(annotation=>{

            /* const fieldManager = annotationManager.getFieldManager();
            const field = fieldManager.getField(annotation.Id);
            console.log('field',field) */

            const fieldManager = annotationManager.getFieldManager();
            fieldManager.forEachField((field)=>{
              // https://www.pdftron.com/api/web/Core.Annotations.Forms.Field.html
              console.log('field',field)
              console.log('field.type',field.type)
              console.log('field.flags',field.flags)
            });

            // fieldManager.forEachField(getFieldNameAndValue);
            return annotation
          });
    
          // if (annotations === null && action === 'deselected') {
          //   console.log('all annotations deselected');
          // }
        });
        function deleteField(annotation){
          annotationManager.deleteAnnotations([annotation])
        }
        setController(baseController=>({
          ...baseController,
          deleteField: deleteField
        }));
      /* ===== RIGHT SIDEBAR - Element Selection ===== */
    })
  },[])
  return (
    <div className="App">
      <div className="actions">
        <button type="button" onClick={controller.selectToolbarGroupForms}>Select Forms</button>
      </div>
      <div className="interface">
        <div className="left-sidebar">
          <button type="button" onClick={controller.insertTextField}>Textbox</button> <b>no edit</b><br />
          <button type="button" onClick={controller.insertCheckboxField}>Checkbox</button><br />
          <button type="button" onClick={controller.insertDropdownField}>Dropdown</button> <b>no edit</b><br />
          <button type="button" onClick={controller.insertRadioField}>Radio button</button><br />
          <button type="button" onClick={controller.insertSignatureField}>Signature</button><br />
          <p><b>no insert in edit</b></p>
        </div>
        <div className="webviewer" ref={viewerDiv}></div>
        <div className="right-sidebar">
          {controller.selectedElements.length<1?(
            <div className="page-manipulation">
              <h2>Form details</h2>
              <p>Viewing: Page  <b>{controller.currentPage}</b> of {controller.pageCount}</p>
              <ul>
                {
                  pages.map(page=>(<li key={page.number}>
                    <button type="button" onClick={()=>controller.goToPage(page.number)}>
                      <img src={page.thumbnail} width="50px" alt={`Page ${page.number}`} />
                    </button>
                  </li>
                  ))
                }
              </ul>
            </div>
          ):(
            <div className="element-selection">
              {controller.selectedElements.map(annotation=>(<span key={annotation.Id}>
                {/* https://www.pdftron.com/api/web/Core.Annotations.Annotation.html */}
                {/* https://www.pdftron.com/api/web/Core.Annotations.Forms.FieldManager.html#main */}
                <h2>{annotation.getFormFieldPlaceHolderType()}</h2>
                <button type="button" onClick={()=>controller.deleteField(annotation)}>Remove</button>
                <p>Required:</p>
                <p>Field name:</p>
                <p>Helper:</p>
              </span>))}
            </div>
          )}
        </div>
      </div>
      <div className="bottom">
      <button type="button">Upload</button>
      </div>
    </div>
  );
}

export default App;
