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













  const [mousePosition,setMousePosition] = useState({
    x: undefined,
    y: undefined,
  });
  function onMouseUpdate(e) {
    console.log('e.pageX',e.pageX);
    console.log('e.pageY',e.pageY);
    setMousePosition({
      x: e.pageX,
      y: e.pageY,
    });
  }
  useEffect(()=>{
    document.addEventListener('mousemove', onMouseUpdate, false);
    document.addEventListener('mouseenter', onMouseUpdate, false);

    return ()=>{
      document.removeEventListener('mousemove');
      document.removeEventListener('mouseenter');
    }
  },[])


  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  function base64ToBlob(base64) {
    // console.log("(base64.split(',')[1])", (base64.split(',')[1]));
    const binaryString = window.atob(base64.split(',')[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'application/pdf' });
  };
















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
      console.log('instance.Core',instance.Core)
      console.log('instance.UI',instance.UI)
      // DRAG AND DROP
      let webViewerMousePosition = {
        x: undefined,
        y: undefined,
      };
      function onWebViewerMouseUpdate(e) {
        console.log('e.pageX wv',e.pageX);
        console.log('e.pageY wv',e.pageY);
        webViewerMousePosition = {
          x: e.pageX,
          y: e.pageY,
        };
      }
      instance.iframeWindow.document.addEventListener('mousemove', onWebViewerMouseUpdate, false);
      instance.iframeWindow.document.addEventListener('mouseenter', onWebViewerMouseUpdate, false);
      // DRAG AND DROP
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
        function insertProgrammaticallyTextField(event,mouseX,mouseY){
          // set flags for multiline and required
          const flags = new Annotations.WidgetFlags();
          // flags.set('Multiline', true);
          flags.set('Required', true);
          flags.set('Edit', true);

          // set font type
          const font = new Annotations.Font({ name: 'Helvetica' });

          // create a form field
          const field = new Annotations.Forms.Field("FormAnnotation-TextField", {
            type: 'Tx',
            // defaultValue: "some placeholder default text value",
            value: "Text",
            flags,
            font,
          });
          const pageNumber = 1;

          /**
           * =======================
           * ==== DRAG AND DROP ====
           * =======================
           */
          // https://www.pdftron.com/documentation/web/guides/coordinates/
          const displayMode = instance.Core.documentViewer.getDisplayModeManager().getDisplayMode();

          const getMouseLocation = e => {
            const scrollElement = documentViewer.getScrollViewElement();
            const scrollLeft = scrollElement.scrollLeft || 0;
            const scrollTop = scrollElement.scrollTop || 0;

            if(e.pageX === 0 && e.pageY === 0){
              e.pageX = e.screenX - e.target.offsetHeight * 10;
              e.pageY = e.screenY - e.target.offsetTop * 1.7;
              // mouseX = e.screenX - e.target.offsetHeight * 10;
              // mouseY = e.screenY - e.target.offsetTop * 1.7;
            }
            console.log(`
              e.pageX ${e.pageX}\n
              e.pageY ${e.pageY}\n

              mouseX ${mouseX}\n
              mouseY ${mouseY}\n

              webViewerMousePosition.x ${webViewerMousePosition.x}\n
              webViewerMousePosition.y ${webViewerMousePosition.y}\n

              mouseX+webViewerMousePosition.x ${mouseX+webViewerMousePosition.x}\n
              mouseY+webViewerMousePosition.y ${mouseY+webViewerMousePosition.y}\n

              viewerDiv.current.getBoundingClientRect().top ${viewerDiv.current.getBoundingClientRect().top}\n
              viewerDiv.current.getBoundingClientRect().left ${viewerDiv.current.getBoundingClientRect().left}\n

              viewerDiv.current.getBoundingClientRect().top+webViewerMousePosition.x ${viewerDiv.current.getBoundingClientRect().top+webViewerMousePosition.x}\n
              viewerDiv.current.getBoundingClientRect().left+webViewerMousePosition.y ${viewerDiv.current.getBoundingClientRect().left+webViewerMousePosition.y}\n
            `);

            return {
              x: Number(mouseX) + scrollLeft,
              y: Number(mouseY) + scrollTop
            };

            // return {
            //   x: (Number(mouseX) + Math.round(Number(viewerDiv.current.getBoundingClientRect().top)) + scrollLeft),
            //   y: (Number(mouseY) + Math.round(Number(viewerDiv.current.getBoundingClientRect().left)) + scrollTop)
            // };
          
            // return {
            //   x: e.pageX + scrollLeft,
            //   y: e.pageY + scrollTop
            // };
          };
          const windowCoordinates = getMouseLocation(event);

          console.log('windowCoordinates',windowCoordinates);

          const page = displayMode.getSelectedPages(windowCoordinates, windowCoordinates);
          const droppedPage = (page.first !== null) ? page.first : documentViewer.getCurrentPage();

          const pageCoordinates = displayMode.windowToPage(windowCoordinates, droppedPage);

          console.log('pageCoordinates',pageCoordinates);

          // const zoom = instance.Core.documentViewer.getZoom();

          // console.log('zoom',zoom);

          // const pagePoint = {
          //   x: pageCoordinates.x * zoom,
          //   y: pageCoordinates.y * zoom
          // };

          const pagePoint = {
            x: pageCoordinates.x,
            y: pageCoordinates.y
          };

          console.log('pagePoint',pagePoint);

          // create a widget annotation
          const widgetAnnot = new Annotations.TextWidgetAnnotation(field)

          // set position and size
          widgetAnnot.PageNumber = pageNumber;
          widgetAnnot.X = pagePoint.x;
          widgetAnnot.Y = pagePoint.y;
          widgetAnnot.Width = 50;
          widgetAnnot.Height = 20;
          widgetAnnot.backgroundColor = new Annotations.Color(255,255,255,0.4);

          //add the form field and widget annotation
          annotationManager.getFieldManager().addField(field);
          annotationManager.addAnnotation(widgetAnnot);
          annotationManager.drawAnnotationsFromList([widgetAnnot]);
        }
        setController(baseController=>({
          ...baseController,
          insertTextField: insertProgrammaticallyTextField
        }));
        function insertProgrammaticallyCheckboxField(){
          // set flags for required and edit
          const flags = new Annotations.WidgetFlags();
          // flags.set('Required', true);
          flags.set('Edit', true);
      
          // set font type
          const font = new Annotations.Font({ name: 'Helvetica' });
      
          // create a form field
          // https://www.pdftron.com/api/web/Core.Annotations.Forms.Field.html
          const field = new Annotations.Forms.Field("FormAnnotation-CheckboxField", {
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
          annotationManager.getFieldManager().addField(field);
          annotationManager.addAnnotation(widgetAnnot);
          annotationManager.drawAnnotationsFromList([widgetAnnot]);
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
          const field = new Annotations.Forms.Field("FormAnnotation-RadioField", {
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
          annotationManager.getFieldManager().addField(field);
          annotationManager.addAnnotation(widgetAnnot1);
          annotationManager.addAnnotation(widgetAnnot2);
          annotationManager.drawAnnotationsFromList([widgetAnnot1, widgetAnnot2]);
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
          widgetAnnot.backgroundColor = new Annotations.Color(255,255,255,0.4);

          //add the form field and widget annotation
          annotationManager.getFieldManager().addField(field);
          annotationManager.addAnnotation(widgetAnnot);
          annotationManager.drawAnnotationsFromList([widgetAnnot]);
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
          annotationManager.getFieldManager().addField(field);
          annotationManager.addAnnotation(widgetAnnot);
          annotationManager.drawAnnotationsFromList([widgetAnnot]);
        }
        setController(baseController=>({
          ...baseController,
          insertSignatureField: insertProgrammaticallySignatureField
        }));
      /* ===== LEFT SIDEBAR - Insertions ===== */

      /* ===== RIGHT SIDEBAR - Page manipulation ===== */
        documentViewer.addEventListener('documentLoaded', async () => {
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
          const req = new XMLHttpRequest();
          const xfdfString = await annotationManager.exportAnnotations();
          const options = { xfdfString };
          const data = await doc.getFileData(options);
          const arr = new Uint8Array(data);
          const blob = new Blob([arr], { type: 'application/pdf' });
          req.open("POST", '/api/test', true);
          req.onload = function (oEvent) {
            console.log(oEvent);
          };
          blobToBase64(blob).then(res => {
            req.send(res);
            console.log("res");
            console.log(res);
            console.log("res");
            const result = "data:application/pdf;base64,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";
            console.log("           ---------------      ",instance.UI.loadDocument(base64ToBlob(result), { filename: 'PDFTRON_about.pdf'}));
            instance.UI.loadDocument(base64ToBlob(result),{ filename: 'PDFTRON_about.pdf'});
            });
          // blobToBase64(blob).then(res => {
          //   console.log(res);
          //   req.send(res);
          // });
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
          const fieldManager = annotationManager.getFieldManager();
          const field = fieldManager.getField(annotation.Hi['trn-form-field-name']);
          console.log('field',field)
          console.log('field.flags',field.flags)
          return ({
            isRequired: field.flags.ik.Required,
          })
        }
        setController(baseController=>({
          ...baseController,
          getFieldData: getFieldData
        }));
        documentViewer.addEventListener('documentLoaded', () => {
          documentViewer.getAnnotationsLoadedPromise().then(function() {
            const allAnnotations = annotationManager.getAnnotationsList();
            console.log('allAnnotations',allAnnotations)

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

  const [dragMousePosition,setDragMousePosition] = useState({
    x: undefined,
    y: undefined,
  });

  const allowDrop = (ev) => {
    console.log("allowDrop start");
    ev.preventDefault();
  }

  const drag = (e) => {
    var posX = e.clientX;
    var posY = e.clientY;
    e.dataTransfer.setData("x", posX);
    e.dataTransfer.setData("y", posY);
    e.dataTransfer.setData("x", e.screenX);
    e.dataTransfer.setData("y", e.screenY);
  }

  const drop = (e) => {
    e.preventDefault();
    const firefoxSupport = {
        x: e.screenX - (e.target.offsetHeight * 10),
        y: e.screenY - (e.target.offsetTop * 1.7),
    };
    controller.insertTextField(e,dragMousePosition.x||firefoxSupport.x,dragMousePosition.y||firefoxSupport.y);
  }

  const ondragging = (e) => {
    var x = e.dataTransfer.getData("x");
    var y = e.dataTransfer.getData("y");
    if(e.pageX > 0 && e.pageY > 0) setDragMousePosition({
      x: e.pageX,
      y: e.pageY,
    });
    // if(e.pageX === 0 && e.pageY === 0) setDragMousePosition({
    //   x: x,
    //   y: y,
    // });
  }
  return (
    <div className="App">
      <div className="actions">
        <button type="button" onClick={controller.selectToolbarGroupForms}>Select Forms</button>
        {/* <button type="button" onClick={controller.selectTextBoxCreating}>Texbox Creation</button>
        <button type="button" onClick={controller.selectCheckboxCreating}>CheckBox Creation</button> */}
      </div>
      <div className="interface">
        <div className="left-sidebar">
        <button 
          draggable 
          onDragStart={(e)=> drag(e)} 
          onDrag={ondragging}
          onDragEnd={drop} 
          // onMouseLeave={drop}
          onDragOver={allowDrop}
          // onMouseUp={drop}
          // onDrop={drop}
          // onDragCapture={drop}
          // onDropCapture={drop}
        >Textbox</button><br />
          {/* <button type="button" onClick={controller.insertTextField}>Textbox</button><br /> */}
          <button type="button" onClick={controller.insertCheckboxField}>Checkbox</button><br />
          <button type="button" onClick={controller.insertDropdownField}>Dropdown</button><br />
          <button type="button" onClick={controller.insertRadioField}>Radio button</button><br />
          <button type="button" onClick={controller.insertSignatureField}>Signature</button><br />
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
