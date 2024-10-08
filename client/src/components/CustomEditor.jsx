import React, { useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  CompositeDecorator,
} from "draft-js";
import {
  TextBolder,
  TextItalic,
  TextUnderline,
  ListBullets,
  ListNumbers,
  Quotes,
  Code,
  TextStrikethrough,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  CodeSimple,
  LinkBreak,
  LinkSimple,
} from "phosphor-react";
import CustomButton from "./CustomButton";
import CustomTooltip from "./CustomTooltip";
import CustomTypography from "./CustomTypography";
import useOnClickOutside from "../hooks/useOnClickOutside";
import clsx from "clsx";
import "../styles/customEditor.css";

const styles = {
  editor: {
    base: "bg-white border ring-0 rounded-lg transition-all duration-200",
    answer: "bg-white rounded-lg transition-all duration-200",
    question: "bg-gray-100 rounded-lg transition-all duration-200",
  },
  states: {
    enabled:
      "border-gray-300 ring-primary-50 focus-within:border-primary-300 focus-within:ring-4",
    error: "border border-error-300 ring-red-100 focus-within:ring-4",
  },
  toolbar: {
    base: "flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-300",
    answer:
      "flex flex-wrap items-center gap-2 px-4 py-3 rounded-lg border border-gray-300",
    question:
      "bg-gray-200 flex flex-wrap items-center gap-2 px-4 py-3 rounded-lg",
  },
  urlInputContainer:
    "absolute z-elevate bg-white border border-gray-300 rounded p-3",
  urlInput:
    "px-2 py-1 outline-none border border-gray-300 rounded focus:border-primary-400",
  link: "text-blue-500 underline",
  button: {
    base: "inline-block text-gray-700 p-1 rounded",
    active: "bg-primary-50 text-primary-500",
  },
  block: {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    ul: "list-disc ml-5",
    ol: "list-decimal ml-5",
    blockquote: "border-l-4 border-primary-300 py-1.5 px-4 my-2",
    codeBlock: "bg-primary-300 text-white p-4 rounded",
  },
};

const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontSize: 16,
    padding: 4,
    borderRadius: "4px",
  },
};

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case "left":
      return styles.block.left;
    case "center":
      return styles.block.center;
    case "right":
      return styles.block.right;
    case "unordered-list-item":
      return styles.block.ul;
    case "ordered-list-item":
      return styles.block.ol;
    case "blockquote":
      return styles.block.blockquote;
    case "code-block":
      return styles.block.codeBlock;
    default:
      return null;
  }
};

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

const Link = ({ contentState, entityKey, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();

  return (
    <a href={url} className={styles.link}>
      {children}
    </a>
  );
};

export default function CustomEditor({
  label,
  placeholder = "Enter a description",
  minHeight,
  isRequired = false,
  defaultValue,
}) {
  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);
  console.log({ defaultValue });
  const initialState = defaultValue
    ? () =>
        EditorState.moveFocusToEnd(
          EditorState.createWithContent(defaultValue, decorator)
        )
    : () => EditorState.createEmpty(decorator);
  const [editorState, setEditorState] = useState(initialState);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const inputContainerRef = useRef(null);
  const contentState = editorState.getCurrentContent();
  console.log({ contentState });

  const onClose = () => setShowUrlInput(false);

  useOnClickOutside(inputContainerRef, onClose);

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  const onFocus = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const onURLChange = (event) => setUrlValue(event.target.value);

  const onLinkInputKeyDown = (event) => {
    if (event.which === 13) {
      confirmLink(event);
    }
  };

  const promptForLink = (event) => {
    event.preventDefault();
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
      let url = "";

      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      setShowUrlInput(true);
      setUrlValue(url);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  };

  const confirmLink = (event) => {
    event.preventDefault();
    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url: urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    let nextEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    nextEditorState = RichUtils.toggleLink(
      nextEditorState,
      nextEditorState.getSelection(),
      entityKey
    );

    setEditorState(nextEditorState);
    setShowUrlInput(false);
    setUrlValue("");
    setTimeout(() => editorRef.current && editorRef.current.focus(), 0);
  };

  const removeLink = (event) => {
    event.preventDefault();
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  const checkContent = () => {
    console.log({ contentState });
    // if (!contentState.hasText()) {
    //   if (contentState.getBlockMap().first().getType() !== "unstyled") {
    //     return true;
    //   }
    //   return false;
    // }
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  const handleKeyBindingFn = (event) => {
    if (event.keyCode === 9) {
      const newEditorState = RichUtils.onTab(event, editorState, 4);

      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(event);
  };

  const EDITOR_CONTROLS = [
    { icon: TextBolder, label: "Bold", style: "BOLD", type: "inlineStyle" },
    { icon: TextItalic, label: "Italic", style: "ITALIC", type: "inlineStyle" },
    {
      icon: TextUnderline,
      label: "Underline",
      style: "UNDERLINE",
      type: "inlineStyle",
    },
    {
      icon: TextStrikethrough,
      label: "Strikethrough",
      style: "STRIKETHROUGH",
      type: "inlineStyle",
    },
    { icon: CodeSimple, label: "Code", style: "CODE", type: "inlineStyle" },
    {
      icon: TextAlignLeft,
      label: "Text left",
      style: "left",
      type: "blockType",
    },
    {
      icon: TextAlignCenter,
      label: "Text center",
      style: "center",
      type: "blockType",
    },
    {
      icon: TextAlignRight,
      label: "Text right",
      style: "right",
      type: "blockType",
    },
    {
      icon: ListBullets,
      label: "Unordered list",
      style: "unordered-list-item",
      type: "blockType",
    },
    {
      icon: ListNumbers,
      label: "Ordered list",
      style: "ordered-list-item",
      type: "blockType",
    },
    {
      icon: Quotes,
      label: "Blockquote",
      style: "blockquote",
      type: "blockType",
    },
    { icon: Code, label: "Code block", style: "code-block", type: "blockType" },
  ];

  const handleClickEditorControl = ({ controlType, style }) => {
    if (controlType === "inlineStyle") {
      console.log({ style });
      onChange(RichUtils.toggleInlineStyle(editorState, style));
    } else {
      onChange(RichUtils.toggleBlockType(editorState, style));
    }
  };

  const EditorControl = ({ control, active }) => {
    return (
      <span
        className={clsx(
          "cursor-pointer inline-block p-1 border",
          active && "bg-[#eee]"
        )}
        onMouseDown={(e) => {
          e.preventDefault();
          handleClickEditorControl({
            controlType: control.type,
            style: control.style,
          });
        }}
      >
        <control.icon size={20} />
      </span>
    );
  };

  const renderEditorControl = () => {
    return (
      <div className="flex gap-2 p-2 border-b">
        {EDITOR_CONTROLS.map((control, index) => {
          const checkActive = () => {
            if (control.type === "inlineStyle") {
              const currentStyle = editorState.getCurrentInlineStyle();
              console.log({
                currentStyle,
                "currentStyle.has(control.style)": currentStyle.has(
                  control.style
                ),
              });
              return currentStyle.has(control.style);
            } else {
              const selection = editorState.getSelection();
              const blockType = editorState
                .getCurrentContent()
                .getBlockForKey(selection.getStartKey())
                .getType();
              return control.style === blockType;
            }
          };

          return (
            <EditorControl
              key={index}
              control={control}
              active={checkActive()}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {/* {label && (
        <CustomTypography
          weight="medium"
          fontSize="text-md"
          className="mb-1.5 text-gray-700"
        >
          {label}
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </CustomTypography>
      )} */}
      <div className="border border-primary-400 rounded-[8px] ring-primary-100 focus-within:border-primary-100 focus-within:ring-4">
        {/* <div className={styles.toolbar}>
          <InlineStyleControls
            editorState={editorState}
            onToggle={toggleInlineStyle}
          />
          <BlockStyleControls
            editorState={editorState}
            onToggle={toggleBlockType}
          />
          <div className="relative leading-none">
            <CustomTooltip
              className="w-auto whitespace-nowrap"
              title="Add link"
            >
              <span
                role="button"
                className={clsx(styles.button.base)}
                onMouseUp={promptForLink}
              >
                <LinkSimple size={20} />
              </span>
            </CustomTooltip>
            {showUrlInput && (
              <div ref={inputContainerRef} className={styles.urlInputContainer}>
                <label>
                  <div className="font-medium text-gray-700 text-sm mb-0.5">
                    URL
                  </div>
                  <input
                    onChange={onURLChange}
                    ref={inputRef}
                    className={styles.urlInput}
                    type="text"
                    value={urlValue}
                    onKeyDown={onLinkInputKeyDown}
                  />
                </label>
                <div className="flex justify-end">
                  <CustomButton
                    className="mt-2"
                    size="xs"
                    onMouseUp={confirmLink}
                  >
                    Insert
                  </CustomButton>
                </div>
              </div>
            )}
          </div>
          <CustomTooltip
            className="w-auto whitespace-nowrap"
            title="Remove link"
          >
            <span
              role="button"
              className={clsx(styles.button.base)}
              onMouseUp={removeLink}
            >
              <LinkBreak size={20} />
            </span>
          </CustomTooltip>
        </div> */}
        {renderEditorControl({ editorState, onChange })}
        <div className={clsx("p-2 text-left h-[200px]")} onClick={onFocus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={handleKeyBindingFn}
            onChange={onChange}
            placeholder={placeholder}
            ref={editorRef}
            // spellCheck={true}
          />
        </div>
      </div>
    </div>
  );
}
