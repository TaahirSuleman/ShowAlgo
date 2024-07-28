import { Box, Center, Spinner, Button } from "@chakra-ui/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

const CodeEditorView = ({
  language,
  value,
  setValue,
  defaultValue,
  height,
  width,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [editor, setEditor] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const monaco = useMonaco();
  

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // whether to inherit the base theme's rules

        rules: [
          { token: 'comment', foreground: 'ffa500', fontStyle: 'italic underline' },
          { token: 'keyword', foreground: 'ff0000', fontStyle: 'bold' },

        ],
        colors: {
          'editor.foreground': '#FFFFFF',
          'editor.background': '#0000004C',
          'editor.lineHighlightBorder': '#00000000',
          'editor.lineHighlightBackground': '#0000001C',
          // variable color
          

        }
      });
    }
  }, [monaco]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleEditorDidMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  const highlightLines = (editor, lines) => {
    lines.forEach(({ line, time }) => {
      setTimeout(() => {
        setDecorations((oldDecorations) =>
          editor.deltaDecorations(oldDecorations, [
            {
              range: new monaco.Range(line, 1, line, 1),
              options: {
                isWholeLine: true,
                className: 'myLineHighlight',
              },
            },
          ])
        );
      }, time);
    });
  };

  const handleHighlightClick = () => {
    if (editor) {
      const linesToHighlight = [
        { line: 1, time: 500 },
        { line: 6, time: 3500 },
        { line: 7, time: 6500 },
        { line: 8, time: 9500 },
        { line: 9, time: 12500 },
        { line: 10, time: 15500 },
        { line: 11, time: 18500 },
        { line: 12, time: 21500 },
        { line: 13, time: 24500 }
        // Add more lines and times as needed
      ];
      highlightLines(editor, linesToHighlight);
    }
  };



  const loadingComponent = (
    <Box display="flex" bg="blackAlpha.700" height={height} justifyContent="center" alignItems="center">
      <Spinner
        thickness="6px"
        speed="0.50s"
        color="purple.400"
        size="xl"

      />
    </Box>
  );

  return (
    <Box overflow="hidden">
      {isLoading ? (
        loadingComponent
      ) : (
        <>
        <Button onClick={handleHighlightClick} mb={4}>
            Start Highlighting
        </Button>
        <Editor
          height={height}
          width={width}
          theme="myCustomTheme"
          language={language}
          defaultValue={defaultValue}
          value={value}
          onChange={(value) => setValue(value)}
          loading={loadingComponent}
          options={
            {
              fontSize: 16,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              wrappingIndent: "same",
              scrollbar: { vertical: "auto", horizontal: "auto" },
            }}
            onMount={handleEditorDidMount}
        />
        </>
      )}
    </Box>
  );
};

export default CodeEditorView;
