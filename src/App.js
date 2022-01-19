import './App.css';
import { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';

// https://www.pdftron.com/documentation/web/guides/forms/apis/
// https://www.pdftron.com/documentation/web/guides/full-api/
function App() {
  const viewerDiv = useRef(null)
  const [annotationLink,setAnnotationLink] = useState({})
  const [controller,setController] = useState({
    /* ===== ACTIONS - Programmatically ===== */
      selectToolbarGroupForms: ()=>{},
      selectTextBoxCreating: ()=>{},
      selectCheckboxCreating: ()=>{},
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
      getFieldData: ()=>{},
      setFieldData: ()=>{},
  })
  const [pages,setPages] = useState([])
  useEffect(()=>{
    WebViewer(
      {
        path: 'lib',
        css: '/assets/stylesheet.css',
        initialDoc: '/files/PDFTRON_about.pdf',
      },
      viewerDiv.current
    ).then((instance)=>{
      const { documentViewer, annotationManager, Annotations, Tools } = instance.Core;
      // console.log('instance.Core',instance.Core)
      // console.log('instance.UI',instance.UI)

      /* ===== SETUP ===== */
      instance.UI.disableElements([
        'annotationCommentButton',
        'annotationStyleEditButton',
        'annotationDeleteButton',
        'linkButton',
      ]);
      /* ===== SETUP ===== */

      /* ===== ACTIONS - Programmatically ===== */
        function selectToolbarGroupForms(){
          instance.UI.setToolbarGroup('toolbarGroup-Forms');
        }
        setController(baseController=>({
          ...baseController,
          selectToolbarGroupForms: selectToolbarGroupForms
        }));
        function selectTextBoxCreating(){
          console.log('instance.UI',instance.UI)
          console.log('Tools.CheckBoxFormFieldCreateTool',Tools.CheckBoxFormFieldCreateTool)
          annotationManager.trigger('textFieldToolGroupButton')
          // instance.UI.disableElement('textFieldToolGroupButton')
          // instance.UI.openElement('textFieldToolGroupButton')
        }
        setController(baseController=>({
          ...baseController,
          selectTextBoxCreating: selectTextBoxCreating
        }));
        function selectCheckboxCreating(){
          annotationManager.trigger('annotation.checkBoxFormField')
          // instance.UI.disableElement('checkBoxFieldToolGroupButton')
          // instance.UI.openElement('checkBoxFieldToolGroupButton')
        }
        setController(baseController=>({
          ...baseController,
          selectCheckboxCreating: selectCheckboxCreating
        }));
      /* ===== ACTIONS - Programmatically ===== */

      /* ===== LEFT SIDEBAR - Insertions ===== */
        function generateGUID(){
          return Math.floor(Math.random() * 9999) + 1000
        }
        function insertAnnotationField({
          field_type,
          patient_facing_field_name,
          field_position: {
            page_number,
            x_coordinate,
            y_coordinate,
            x_length,
            y_length,
          },
        }){
          // https://www.pdftron.com/api/web/Core.Annotations.FreeTextAnnotation.html
          const annotation = new Annotations.FreeTextAnnotation();

          const contents = (field_type==='checkbox')? '' : patient_facing_field_name
          annotation.setContents(contents)

          annotation.PageNumber = page_number;
          annotation.X = x_coordinate;
          annotation.Y = y_coordinate;
          annotation.Width = x_length;
          annotation.Height = y_length;
          annotation.setPadding(new Annotations.Rect(0, 0, 0, 0));

          annotation.FontSize = '16pt';
          annotation.TextColor = new Annotations.Color(1, 96, 204);
          annotation.FillColor = new Annotations.Color(220, 234, 249);
          annotation.StrokeColor = new Annotations.Color(1, 96, 204);
          
          annotation.setRotationControlEnabled(false);

          annotationManager.addAnnotation(annotation, { autoFocus: false });
          annotationManager.redrawAnnotation(annotation);
          annotationManager.selectAnnotation(annotation);
          return annotation;
        }
        function insertProgrammaticallyTextField(){
          const FieldPosition = {
            page_number: instance.UI.getCurrentPageNumber(),
            x_coordinate: 150,
            y_coordinate: 200,
            x_length: 150,
            y_length: 20,
          }
          const IntakeTemplateField = {
            field_id: generateGUID(),
            field_type: 'textbox',
            patient_facing_field_name: 'TextField',
            field_is_required: true,
            field_helper_text: 'HelperText',
            field_position: FieldPosition,
            // option_group_id: '',
          }
          const annotation = insertAnnotationField(IntakeTemplateField);
          setAnnotationLink(baseAnnotationLink=>({
            ...baseAnnotationLink,
            [IntakeTemplateField.field_id]: annotation,
          }))
          console.log('annotation.Id',annotation.Id)
        }
        setController(baseController=>({
          ...baseController,
          insertTextField: insertProgrammaticallyTextField
        }));
        function insertProgrammaticallyCheckboxField(){
          // https://www.pdftron.com/api/web/Core.Annotations.FreeTextAnnotation.html
          const freeText = new Annotations.FreeTextAnnotation();
          freeText.PageNumber = 1;
          freeText.X = 150;
          freeText.Y = 200;
          freeText.Width = 20;
          freeText.Height = 20;
          freeText.setPadding(new Annotations.Rect(0, 0, 0, 0));
          freeText.setContents('');
          freeText.FillColor = new Annotations.Color(220, 234, 249);
          freeText.StrokeColor = new Annotations.Color(1, 96, 204);
          freeText.TextColor = new Annotations.Color(1, 96, 204);
          freeText.FontSize = '16pt';
          freeText.setRotationControlEnabled(false);

          annotationManager.addAnnotation(freeText, { autoFocus: false });
          annotationManager.redrawAnnotation(freeText);
          annotationManager.selectAnnotation(freeText);
        }
        setController(baseController=>({
          ...baseController,
          insertCheckboxField: insertProgrammaticallyCheckboxField
        }));
        function insertProgrammaticallyRadioField(){
          // https://www.pdftron.com/api/web/Core.Annotations.FreeTextAnnotation.html
          const freeText = new Annotations.FreeTextAnnotation();
          freeText.PageNumber = 1;
          freeText.X = 150;
          freeText.Y = 200;
          freeText.Width = 20;
          freeText.Height = 20;
          freeText.setPadding(new Annotations.Rect(0, 0, 0, 0));
          freeText.setContents('');
          freeText.FillColor = new Annotations.Color(220, 234, 249);
          freeText.StrokeColor = new Annotations.Color(1, 96, 204);
          freeText.TextColor = new Annotations.Color(1, 96, 204);
          freeText.FontSize = '16pt';
          freeText.setRotationControlEnabled(false);

          annotationManager.addAnnotation(freeText, { autoFocus: false });
          annotationManager.redrawAnnotation(freeText);
          annotationManager.selectAnnotation(freeText);
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
          const field = new Annotations.Forms.Field("FormAnnotation-BoxField", {
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
          const field = new Annotations.Forms.Field("FormAnnotation-SignatureField", { 
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
        // https://www.pdftron.com/api/web/Core.DocumentViewer.html
        documentViewer.addEventListener('pageNumberUpdated', () => {
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
          setController(baseController=>({
            ...baseController,
            selectedElements: selectedAnnots
          }));
          // console.log('selectedAnnots',selectedAnnots);
          // selectedAnnots.map(annotation=>{

          //   /* const fieldManager = annotationManager.getFieldManager();
          //   const field = fieldManager.getField(annotation.Id);
          //   console.log('field',field) */

          //   const fieldManager = annotationManager.getFieldManager();
          //   fieldManager.forEachField((field)=>{
          //     // https://www.pdftron.com/api/web/Core.Annotations.Forms.Field.html
          //     console.log('field',field)
          //     console.log('field.type',field.type)
          //     console.log('field.flags',field.flags)
          //   });

          //   // fieldManager.forEachField(getFieldNameAndValue);
          //   return annotation
          // });
    
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
        function getFieldData(annotation){
          return ({
            isRequired: 'what',
          })
          /*const fieldManager = annotationManager.getFieldManager();
          const field = fieldManager.getField(annotation.Hi['trn-form-field-name']);
          console.log('field',field)
          console.log('field.flags',field.flags)
          return ({
            isRequired: field.flags.ik.Required,
          })*/
        }
        setController(baseController=>({
          ...baseController,
          getFieldData: getFieldData
        }));
        documentViewer.addEventListener('documentLoaded', () => {
          documentViewer.getAnnotationsLoadedPromise().then(function() {
            function setFieldData(annotation,key,value){
              const fieldManager = annotationManager.getFieldManager();
              const field = fieldManager.getField(annotation.Hi['trn-form-field-name']);
              console.log('field',field)
              console.log('key',key)
              console.log('value',value)
              field.set({
                [key]: value
              })
              // field.widgets.map(annot => {
              //   annot.fieldFlags.set(key,value);
              // });
            }
            setController(baseController=>({
              ...baseController,
              setFieldData: setFieldData
            }));
          });
        });
      /* ===== RIGHT SIDEBAR - Element Selection ===== */
    })
  },[])
  return (
    <div className="App">
      <div className="actions">
        <button type="button" onClick={controller.selectToolbarGroupForms}>Select Forms</button>
        <button type="button" onClick={controller.selectTextBoxCreating}>Texbox Creation</button>
        <button type="button" onClick={controller.selectCheckboxCreating}>CheckBox Creation</button>
        <br/>
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
              <p>Viewing: Page  {controller.currentPage} of {controller.pageCount}</p>
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
                <p>Required: {controller.getFieldData(annotation).isRequired?'yes':'no'} <button type="button" onClick={()=>controller.setFieldData(annotation,'Required',true)}>Yes</button> <button type="button" onClick={()=>controller.setFieldData(annotation,'Required',false)}>No</button></p>
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
