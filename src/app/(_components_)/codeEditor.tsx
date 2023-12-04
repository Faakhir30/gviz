import React from 'react'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools";

const CodeEditor = () => {
    const [value, setValue] = React.useState("");
    const onChange = React.useCallback((val:any, viewUpdate:any) => {
      console.log('val:', val);
      setValue(val);
    }, []);
    const onloadEditor = React.useCallback((editor:any) => {
      console.log('editor:', editor);
    }, []);
    return (
        <AceEditor
        placeholder="Run Queries"
        mode={"mysql"}
        style={{width: "100%", height: "100%"}}
        theme="twilight"
        name="blah2"
        onLoad={onloadEditor}
        onChange={onChange}
        fontSize={20}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={value}
        setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
        }}/>
        )
  }

export default CodeEditor