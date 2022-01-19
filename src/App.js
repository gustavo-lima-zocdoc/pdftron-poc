import './App.css';
import { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';

// https://www.pdftron.com/documentation/web/guides/forms/apis/
// https://www.pdftron.com/documentation/web/guides/full-api/
function App() {
  const viewerDiv = useRef(null)
  const [fields,setFields] = useState([])
  const [annotationsReference,setAnnotationsReference] = useState([])
  // console.log(fields,annotationsReference)
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
      selectedAnnotations: [],
      deleteField: ()=>{},
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
      const { documentViewer, annotationManager, Annotations } = instance.Core;
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
        function insertAnnotation(IntakeTemplateField){
          // https://www.pdftron.com/api/web/Core.Annotations.FreeTextAnnotation.html
          const {
            field_type,
            patient_facing_field_name,
            field_position: {
              page_number,
              x_coordinate,
              y_coordinate,
              x_length,
              y_length,
            },
          } = IntakeTemplateField;

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
          annotation.field = IntakeTemplateField;
          
          annotation.setRotationControlEnabled(false);

          annotationManager.addAnnotation(annotation, { autoFocus: false });
          annotationManager.redrawAnnotation(annotation);

          const selectedAnnotations = annotationManager.getSelectedAnnotations();
          if (selectedAnnotations.length > 0) {
            selectedAnnotations.forEach(selectedAnnotation=>annotationManager.deselectAnnotation(selectedAnnotation));
          }

          annotationManager.selectAnnotation(annotation);

          return annotation;
        }
        function addAnnotationReference({
          field_id,
          annotation_id,
          annotation,
        }){
          setAnnotationsReference(baseAnnotationReference=>[
            ...baseAnnotationReference,
            {
              field_id,
              annotation_id,
              annotation,
            }
          ])
        }
        function handleField(field,action){
          setFields(baseFields=>{
            const foundFieldIndex = baseFields.findIndex(baseField=>baseField.field_id===field.field_id);
            if(foundFieldIndex>=0) {
              const newBaseFields = [...baseFields]
              if(action==='delete') {
                newBaseFields.splice(foundFieldIndex,1)
                return newBaseFields
              }
              newBaseFields[foundFieldIndex] = field
              return newBaseFields
            }
            return [
              ...baseFields,
              field
            ]
          })
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
        annotationManager.addEventListener('annotationChanged', (annotations, action) => {
          annotations.forEach(annotation=>{
            if(annotation.field){
              annotation.field.field_position = {
                page_number: annotation.PageNumber,
                x_coordinate: annotation.X,
                y_coordinate: annotation.Y,
                x_length: annotation.Width,
                y_length: annotation.Height,
              }
              handleField(annotation.field,action);
            }
          });
        });
        annotationManager.addEventListener('annotationSelected', (annotations, action) => {
          // if (action === 'selected') {
          //   console.log('annotation selection');
          // } else if (action === 'deselected') {
          //   console.log('annotation deselection');
          // }
          const selectedAnnotations = annotationManager.getSelectedAnnotations();
          setController(baseController=>({
            ...baseController,
            selectedAnnotations,
          }));
        });
        function deleteField(annotation){
          annotationManager.deleteAnnotations([annotation])
        }
        setController(baseController=>({
          ...baseController,
          deleteField: deleteField
        }));
        function setFieldData(annotation,key,value){
          annotation.field[key]=value;
          if(key==='patient_facing_field_name'&&annotation.field.field_type!=='checkbox'){
            annotation.setContents(value);
          }
          annotationManager.updateAnnotation(annotation);
          handleField(annotation.field,'modify');
        }
        setController(baseController=>({
          ...baseController,
          setFieldData: setFieldData
        }));
      /* ===== RIGHT SIDEBAR - Element Selection ===== */
    })
  },[])
  return (
    <div className="App">
      <div className="actions">
        <button type="button" onClick={controller.selectToolbarGroupForms}>Select Forms</button>
        {/* {JSON.stringify(annotationsReference)} */}
        {JSON.stringify(fields)}
        <br/>
      </div>
      <div className="interface">
        <div className="left-sidebar">
          <button type="button" onClick={controller.insertTextField}>Textbox</button><br />
          <button type="button" onClick={controller.insertCheckboxField}>Checkbox</button><br />
        </div>
        <div className="webviewer" ref={viewerDiv}></div>
        <div className="right-sidebar">
          {controller.selectedAnnotations.length<1?(
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
              {controller.selectedAnnotations.map(annotation=>(<span key={annotation.Id}>
                {/* https://www.pdftron.com/api/web/Core.Annotations.Annotation.html */}
                {/* https://www.pdftron.com/api/web/Core.Annotations.Forms.FieldManager.html#main */}
                <h2>{annotation.field.field_type}</h2>
                <button type="button" onClick={()=>controller.deleteField(annotation)}>Remove</button>
                <p>Required: {fields.find(field=>field.field_id===annotation.field.field_id)?.field_is_required?'yes':'no'} <button type="button" onClick={()=>controller.setFieldData(annotation,'field_is_required',true)}>Yes</button> <button type="button" onClick={()=>controller.setFieldData(annotation,'field_is_required',false)}>No</button></p>
                <p>Field name: <input type="text" value={fields.find(field=>field.field_id===annotation.field.field_id)?.patient_facing_field_name} onChange={(e)=>controller.setFieldData(annotation,'patient_facing_field_name',e.target.value)} /></p>
                <p>Helper: <input type="text" value={fields.find(field=>field.field_id===annotation.field.field_id)?.field_helper_text} onChange={(e)=>controller.setFieldData(annotation,'field_helper_text',e.target.value)} /></p>
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
