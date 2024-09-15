import { Box, Fade, Spinner } from "@chakra-ui/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useState, useRef } from "react";

const CodeEditorView = ({
  language,
  value,
  setValue,
  defaultValue,
  height,
  width,
  movementsState,
  highlightState,
  pauseState,
  indexState
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [editor, setEditor] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const monaco = useMonaco();
  const timerRefs = useRef([]); // Ref to store timeout IDs

  useEffect(() => {
    if (monaco) {
      // Register and define your custom language
      monaco.languages.register({ id: "customLanguage" });

      monaco.languages.setMonarchTokensProvider("customLanguage", {
        tokenizer: {
          root: [
            // Explicitly define case-insensitive keywords
            [/\bset\b|\bSET\b/i, "keyword"],
            [/".*?"/, "string"], // String literals
            [/\bto\b|\bTO\b|\bup\b|\bUP\b/i, "keyword"],
            [
              /\bnumber\b|\bNUMBER\b|\bstring\b|\bSTRING\b|\bboolean\b|\bBOOLEAN\b/i,
              "type",
            ],
            [
              /\bcreate\b|\bCREATE\b|\bas\b|\bAS\b|\bwith\b|\bWITH\b|\badd\b|\bADD\b|\binsert\b|\bINSERT\b|\bdelete\b|\bDELETE\b|\bremove\b|\bREMOVE\b|\binto\b|\bINTO\b|\bfrom\b|\bFROM\b|\barray\b|\bARRAY\b|\breturn\b|\bRETURN\b|\bvalues\b|\bVALUES\b|\bat\b|\bAT\b|\bof\b|\bOF\b/i,
              "keyword.methods",
            ],
            [
              /\bif\b|\bIF\b|\bIS\b|\bis\b|\bequal\b|\bEQUAL\b|\bgreater\b|\bGREATER\b|\bless\b|\bLESS\b|\bthan\b|\bTHAN\b|\bthen\b|\bTHEN\b|\botherwise\b|\bOTHERWISE\b|\bend\s*if\b|\bEND\s*IF\b/i,
              "keyword.control",
            ],
            [
              /\bloop\b|\bLOOP\b|\buntil\b|\bUNTIL\b|\bend\s*loop\b|\bEND\s*LOOP\b|\bfor each\b|\bFOR EACH\b|\bin\b|\bIN\b/i,
              "keyword.control",
            ],
            [/\btrue\b|\bTRUE\b|\bfalse\b|\bFALSE\b|\band\b|\bAND\b|\bor\b|\bOR\b|\bnot\b|\bNOT\b/i, "keyword.boolean"],
            [
              /\band\b|\bAND\b|\bor\b|\bOR\b|\bnot\b|\bNOT\b/i,
              "keyword.operator",
            ],
            [
              /\bdefine\b|\bDEFINE\b|\bparameters\b|\bPARAMETERS\b|\bend\s*function\b|\bEND\s*FUNCTION\b|\bsubstring\b|\bSUBSTRING\b|\blength\b|\bLENGTH\b|\bcharacter\b|\bCHARACTER\b/i,
              "keyword.function",
            ],
            [/\bsize\b|\bSIZE\b/i, "keyword"],
            [/\bprint\b|\bPRINT\b|\bdisplay\b|\bDISPLAY\b/i, "keyword"],
          ],
        },
      });

      monaco.editor.defineTheme("myCustomTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          {
            token: "keyword",
            foreground: "C678DD", // Purple, commonly used for keywords in One Dark Pro
          },
          {
            token: "keyword.control",
            foreground: "E06C75", // A soft red, often used for control structures
          },
          {
            token: "keyword.methods",
            foreground: "61AFEF", // A light blue for method names
          },
          {
            token: "type",
            foreground: "E5C07B", // A warm yellow, often used for types and classes
          },
          {
            token: "keyword.boolean",
            foreground: "D19A66", // A warm orange for boolean values
          },
          {
            token: "keyword.operator",
            foreground: "56B6C2",
          },
          {
            token: "keyword.function",
            foreground: "61AFEF",
          },
          {
            token: "string",
            foreground: "98C379", // A green color for strings, typical in One Dark Pro
          },

          // { token: "comment", foreground: "808080", fontStyle: "italic" },
        ],
        colors: {
          "editor.foreground": "#FFFFFF",
          "editor.background": "#0000004C",
          "editor.lineHighlightBorder": "#00000000",
          "editor.lineHighlightBackground": "#0000001C",
        },
      });

      // Register the autocomplete provider
      monaco.languages.registerCompletionItemProvider("customLanguage", {
        provideCompletionItems: () => {
          const suggestions = [
            // Autocomplete suggestions for both lower and uppercase
            {
              label: "set",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "set",
              detail: "Keyword: set",
            },
            {
              label: "SET",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "SET",
              detail: "Keyword: SET",
            },
            {
              label: "to",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "to",
              detail: "Keyword: to",
            },
            {
              label: "TO",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "TO",
              detail: "Keyword: TO",
            },
            {
              label: "number",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "number",
              detail: "Data type: number",
            },
            {
              label: "NUMBER",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "NUMBER",
              detail: "Data type: NUMBER",
            },
            {
              label: "string",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "string",
              detail: "Data type: string",
            },
            {
              label: "STRING",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "STRING",
              detail: "Data type: STRING",
            },
            {
              label: "boolean",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "boolean",
              detail: "Data type: boolean",
            },
            {
              label: "BOOLEAN",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "BOOLEAN",
              detail: "Data type: BOOLEAN",
            },
            {
              label: "create",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "create",
              detail: "Keyword: create",
            },
            {
              label: "CREATE",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "CREATE",
              detail: "Keyword: CREATE",
            },
            {
              label: "as",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "as",
              detail: "Keyword: as",
            },
            {
              label: "AS",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "AS",
              detail: "Keyword: AS",
            },
            {
              label: "with",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "with",
              detail: "Keyword: with",
            },
            {
              label: "WITH",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "WITH",
              detail: "Keyword: WITH",
            },
            {
              label: "add",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "add",
              detail: "Keyword: add",
            },
            {
              label: "ADD",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "ADD",
              detail: "Keyword: ADD",
            },
            {
              label: "insert",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "insert",
              detail: "Keyword: insert",
            },
            {
              label: "INSERT",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "INSERT",
              detail: "Keyword: INSERT",
            },
            {
              label: "delete",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "delete",
              detail: "Keyword: delete",
            },
            {
              label: "DELETE",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "DELETE",
              detail: "Keyword: DELETE",
            },
            {
              label: "remove",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "remove",
              detail: "Keyword: remove",
            },
            {
              label: "REMOVE",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "REMOVE",
              detail: "Keyword: REMOVE",
            },
            {
              label: "into",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "into",
              detail: "Keyword: into",
            },
            {
              label: "INTO",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "INTO",
              detail: "Keyword: INTO",
            },
            {
              label: "from",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "from",
              detail: "Keyword: from",
            },
            {
              label: "FROM",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "FROM",
              detail: "Keyword: FROM",
            },
            {
              label: "size",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "size",
              detail: "Keyword: size",
            },
            {
              label: "SIZE",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "SIZE",
              detail: "Keyword: SIZE",
            },
            {
              label: "if",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "if",
              detail: "Control structure: if",
            },
            {
              label: "IF",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "IF",
              detail: "Control structure: IF",
            },
            {
              label: "then",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "then",
              detail: "Control structure: then",
            },
            {
              label: "THEN",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "THEN",
              detail: "Control structure: THEN",
            },
            {
              label: "otherwise",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "otherwise",
              detail: "Control structure: otherwise",
            },
            {
              label: "OTHERWISE",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "OTHERWISE",
              detail: "Control structure: OTHERWISE",
            },
            {
              label: "end if",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "end if",
              detail: "Control structure: end if",
            },
            {
              label: "END IF",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "END IF",
              detail: "Control structure: END IF",
            },
            {
              label: "loop",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "loop",
              detail: "Control structure: loop",
            },
            {
              label: "LOOP",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "LOOP",
              detail: "Control structure: LOOP",
            },
            {
              label: "until",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "until",
              detail: "Control structure: until",
            },
            {
              label: "UNTIL",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "UNTIL",
              detail: "Control structure: UNTIL",
            },
            {
              label: "end loop",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "end loop",
              detail: "Control structure: end loop",
            },
            {
              label: "END LOOP",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "END LOOP",
              detail: "Control structure: END LOOP",
            },
            {
              label: "for each",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "for each",
              detail: "Control structure: for each",
            },
            {
              label: "FOR EACH",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "FOR EACH",
              detail: "Control structure: FOR EACH",
            },
            {
              label: "in",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "in",
              detail: "Control structure: in",
            },
            {
              label: "IN",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "IN",
              detail: "Control structure: IN",
            },
            {
              label: "true",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "true",
              detail: "Boolean value: true",
            },
            {
              label: "TRUE",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "TRUE",
              detail: "Boolean value: TRUE",
            },
            {
              label: "false",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "false",
              detail: "Boolean value: false",
            },
            {
              label: "FALSE",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "FALSE",
              detail: "Boolean value: FALSE",
            },
            {
              label: "and",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "and",
              detail: "Logical operator: and",
            },
            {
              label: "AND",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "AND",
              detail: "Logical operator: AND",
            },
            {
              label: "or",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "or",
              detail: "Logical operator: or",
            },
            {
              label: "OR",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "OR",
              detail: "Logical operator: OR",
            },
            {
              label: "not",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "not",
              detail: "Logical operator: not",
            },
            {
              label: "NOT",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "NOT",
              detail: "Logical operator: NOT",
            },
            {
              label: "define",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "define",
              detail: "Function definition: define",
            },
            {
              label: "DEFINE",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "DEFINE",
              detail: "Function definition: DEFINE",
            },
            {
              label: "parameters",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "parameters",
              detail: "Function definition: parameters",
            },
            {
              label: "PARAMETERS",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "PARAMETERS",
              detail: "Function definition: PARAMETERS",
            },
            {
              label: "end function",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "end function",
              detail: "Function definition: end function",
            },
            {
              label: "END FUNCTION",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "END FUNCTION",
              detail: "Function definition: END FUNCTION",
            },
            {
              label: "print",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "print",
              detail: "Output: print",
            },
            {
              label: "PRINT",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "PRINT",
              detail: "Output: PRINT",
            },
            {
              label: "display",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "display",
              detail: "Output: display",
            },
            {
              label: "DISPLAY",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "DISPLAY",
              detail: "Output: DISPLAY",
            },
            {
              label: "equal",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "equal",
              detail: "Comparison operator: equal",
            },
            {
              label: "EQUAL",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "EQUAL",
              detail: "Comparison operator: EQUAL",
            },
            {
              label: "greater",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "greater",
              detail: "Comparison operator: greater",
            },
            {
              label: "GREATER",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "GREATER",
              detail: "Comparison operator: GREATER",
            },
            {
              label: "less",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "less",
              detail: "Comparison operator: less",
            },
            {
              label: "LESS",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "LESS",
              detail: "Comparison operator: LESS",
            },
            {
              label: "than",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "than",
              detail: "Comparison operator: than",
            },
            {
              label: "THAN",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "THAN",
              detail: "Comparison operator: THAN",
            },
            {
              label: "up",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "up",
              detail: "Range: up",
            },
            {
              label: "UP",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "UP",
              detail: "Range: UP",
            },
            {
              label: "array",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "array",
              detail: "Data structure: array",
            },
            {
              label: "ARRAY",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "ARRAY",
              detail: "Data structure: ARRAY",
            },
            {
              label: "return",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "return",
              detail: "Keyword: return",
            },
            {
              label: "RETURN",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "RETURN",
              detail: "Keyword: RETURN",
            },
            {
              label: "values",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "values",
              detail: "Keyword: values",
            },
            {
              label: "VALUES",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "VALUES",
              detail: "Keyword: VALUES",
            },
            {
              label: "at",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "at",
              detail: "Keyword: at",
            },
            {
              label: "AT",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "AT",
              detail: "Keyword: AT",
            },
            {
              label: "of",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "of",
              detail: "Keyword: of",
            },
            {
              label: "OF",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "OF",
              detail: "Keyword: OF",
            },
            {
              label: "substring",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "substring",
              detail: "Function: substring",
            },
            {
              label: "SUBSTRING",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "SUBSTRING",
              detail: "Function: SUBSTRING",
            },
            {
              label: "length",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "length",
              detail: "Function: length",
            },
            {
              label: "LENGTH",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "LENGTH",
              detail: "Function: LENGTH",
            },
            {
              label: "character",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "character",
              detail: "Function: character",
            },
            {
              label: "CHARACTER",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "CHARACTER",
              detail: "Function: CHARACTER",
            },
          ];
          return { suggestions: suggestions };
        },
      });
    }
  }, [monaco]);

  useEffect(()=>{
    if (indexState < movementsState.length && indexState > -1 && !pauseState && editor){
      console.log("The highlight state: "+highlightState)
      let lineNo = movementsState[indexState].line;
      if (lineNo !== null){
        setDecorations((oldDecorations) =>
          editor.deltaDecorations(oldDecorations, [
            {
              range: new monaco.Range(lineNo, 1, lineNo, 1),
              options: {
                isWholeLine: true,
                className: "myLineHighlight",
              },
            },
          ])
        );
        editor.revealLine(lineNo);
      }
    }
    else if (!highlightState && editor){
      clearHighlights(editor)
    }
  }, [indexState, highlightState])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleEditorDidMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  // Clear all active timers
  const clearTimers = () => {
    timerRefs.current.forEach((id) => clearTimeout(id));
    timerRefs.current = [];
  };

  const clearHighlights = (editor) => {
    setDecorations((oldDecorations) =>
      editor.deltaDecorations(oldDecorations, [])
    );
  };

  const loadingComponent = (
    <Box
      display="flex"
      bg="blackAlpha.600"
      height={height}
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Spinner thickness="6px" speed="0.50s" color="purple.400" size="xl" />
    </Box>
  );

  return (
    <Box overflow="hidden">
      {isLoading ? (
        loadingComponent
      ) : (
        <Fade in={!isLoading}>
          <Editor
            height={height}
            width={width}
            theme="myCustomTheme"
            language="customLanguage"
            defaultValue={defaultValue}
            value={value}
            onChange={(value) => setValue(value)}
            loading={loadingComponent}
            options={{
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
        </Fade>
      )}
    </Box>
  );
};

export default CodeEditorView;
