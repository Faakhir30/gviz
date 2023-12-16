import React from 'react'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";
interface CodeEditorProps {
  value?: string;
  onChange?: any;
}
const CodeEditor = ({value, onChange}:CodeEditorProps) => {
    const onloadEditor = React.useCallback((editor:any) => {
    }, []);
    return (
        <AceEditor
        placeholder="Run Queries"
        mode={"mysql"}
        style={{width: "100%", height: "100%"}}
        theme="textmate"
        name="blah2"
        onLoad={onloadEditor}
        onChange={onChange}
        fontSize={20}
        showPrintMargin={true}
        showGutter={false}
        highlightActiveLine={true}
        value={value}
        setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
        }}/>
        )
  }

export default CodeEditor