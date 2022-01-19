import './App.css';
import { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';

// https://www.pdftron.com/documentation/web/guides/forms/apis/
// https://www.pdftron.com/documentation/web/guides/full-api/
function App() {
  const viewerDiv = useRef(null)
  const [fields,setFields] = useState([])
  const [annotationReference,setAnnotationReference] = useState([])
  const [controller,setController] = useState({
    /* ===== ACTIONS - Programmatically ===== */
      selectToolbarGroupForms: ()=>{},
    /* ===== LEFT SIDEBAR - Insertions ===== */
      insertTextField: ()=>{},
      insertCheckboxField: ()=>{},
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
      /* ===== ACTIONS - Programmatically ===== */

      /* ===== LEFT SIDEBAR - Insertions ===== */
        function generateGUID(){
          return Math.floor(Math.random() * 9999) + 1000
        }
        function insertAnnotation({
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

          const selectedAnnots = annotationManager.getSelectedAnnotations();
          if (selectedAnnots.length > 0) {
            selectedAnnots.forEach(selectedAnnot=>annotationManager.deselectAnnotation(selectedAnnot));
          }

          annotationManager.selectAnnotation(annotation);

          return annotation;
        }
        function addAnnotationReference({
          field_id,
          annotation_id,
          annotation,
        }){
          setAnnotationReference(baseAnnotationReference=>[
            ...baseAnnotationReference,
            {
              field_id,
              annotation_id,
              annotation,
            }
          ])
        }
        function addField(field){
          setFields(baseFields=>[
            ...baseFields,
            field
          ])
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
            field_helper_text: 'HelperText TextField',
            field_position: FieldPosition,
            // option_group_id: '',
          }
          addField(IntakeTemplateField);
          const annotation = insertAnnotation(IntakeTemplateField);
          addAnnotationReference({
            field_id: IntakeTemplateField.field_id,
            annotation_id: annotation.Id,
            annotation,
          });
        }
        setController(baseController=>({
          ...baseController,
          insertTextField: insertProgrammaticallyTextField
        }));
        function insertProgrammaticallyCheckboxField(){
          const FieldPosition = {
            page_number: instance.UI.getCurrentPageNumber(),
            x_coordinate: 150,
            y_coordinate: 300,
            x_length: 20,
            y_length: 20,
          }
          const IntakeTemplateField = {
            field_id: generateGUID(),
            field_type: 'checkbox',
            patient_facing_field_name: 'CheckBoxField',
            field_is_required: true,
            field_helper_text: 'HelperText Checkbox',
            field_position: FieldPosition,
            // option_group_id: '',
          }
          addField(IntakeTemplateField);
          const annotation = insertAnnotation(IntakeTemplateField);
          addAnnotationReference({
            field_id: IntakeTemplateField.field_id,
            annotation_id: annotation.Id,
            annotation,
          });
        }
        setController(baseController=>({
          ...baseController,
          insertCheckboxField: insertProgrammaticallyCheckboxField
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
        <br/>
      </div>
      <div className="interface">
        <div className="left-sidebar">
          <button type="button" onClick={controller.insertTextField}>Textbox</button><br />
          <button type="button" onClick={controller.insertCheckboxField}>Checkbox</button><br />
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
