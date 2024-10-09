import React, { useCallback, useRef, useState } from "react";
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

export default function CustomEditor({
  label,
  placeholder = "Enter a description",
  minHeight,
  isRequired = false,
  defaultValue,
}) {
  const initialState = defaultValue
    ? () =>
        EditorState.moveFocusToEnd(EditorState.createWithContent(defaultValue))
    : () => EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);
  const [showInputLink, setShowInputLink] = useState(false);

  const [inputLinkValue, setInputLinkValue] = useState("");
  const [errorInputLink, setErrorInputLink] = useState("");
  const [error, setError] = useState("");
  const editorRef = useRef(null);
  const inputLinkRef = useRef(null);
  const inputLinkContainerRef = useRef(null);
  const contentState = editorState.getCurrentContent();
  // console.log({ contentState_out: contentState });

  useOnClickOutside({
    ref: inputLinkContainerRef,
    handler: () => setShowInputLink(false),
  });

  const getBlockStyle = (block) => {
    switch (block.getType()) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "unordered-list-item":
        return "list-disc ml-5";
      case "ordered-list-item":
        return "list-decimal ml-5";
      case "blockquote":
        return "border-l-4 border-primary-300 py-1.5 px-4 my-2";
      case "code-block":
        return "bg-primary-300 text-white p-4 rounded";
      default:
        return null;
    }
  };

  const CUSTOM_ENTITY = {
    LINK: "LINK",
    EMBED: "EMBED",
    VIDEO: "VIDEO",
    IMAGE: "IMAGE",
    FILE: "FILE",
  };

  const CustomEntity = ({ block, blockProps, contentState }) => {
    const entity = contentState.getEntity(block.getEntityAt(0));

    const entityType = entity.getType();
    const entityData = entity.getData();

    switch (entityType) {
      case CUSTOM_ENTITY.LINK:
        return (
          <a href={entityData.url} className="text-blue-500 underline">
            {block.getText()}
          </a>
        );

      default:
        return <></>;
    }
  };

  const isLink = (str) => {
    const pattern =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    return !!pattern.test(str);
  };

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  const onFocus = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleChangeInputLinkValue = (event) => {
    setInputLinkValue(event.target.value);
    setErrorInputLink("");
    setTimeout(() => {
      inputLinkRef.current && inputLinkRef.current.focus();
    }, 0);
  };

  const handleEnter = (event) => {
    if (event.which === 13) {
      handleAddLink();
    }
  };
  const handleClickCustomAddLink = () => {
    event.stopPropagation();
    const selection = editorState.getSelection();
    console.log({ selection: selection.isCollapsed() });
    if (selection.isCollapsed()) {
      setError("You need to select text for add link");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const contentState = editorState.getCurrentContent();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
    let url = "";

    if (linkKey) {
      const linkInstance = contentState.getEntity(linkKey);
      url = linkInstance.getData().url;
    }

    setShowInputLink((prev) => !prev);
    setInputLinkValue(url);
    setTimeout(() => {
      inputLinkRef.current && inputLinkRef.current.focus();
    }, 0);
  };

  const handleClickCustomRemoveLink = () => {
    event.preventDefault();
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      setError("You need to select link for remove");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    setEditorState(RichUtils.toggleLink(editorState, selection, null));
    setTimeout(() => editorRef.current && editorRef.current.focus(), 0);
  };

  const handleAddLink = () => {
    if (!isLink(inputLinkValue)) {
      setErrorInputLink("Link not valid");
      return;
    }

    const contentState = editorState.getCurrentContent();
    const newEntity = contentState.createEntity("LINK", "MUTABLE", {
      url: inputLinkValue,
    });
    const entityKey = newEntity.getLastCreatedEntityKey();
    console.log({ entityKey });

    let newEditorState = EditorState.set(editorState, {
      currentContent: newEntity,
    });

    newEditorState = RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey
    );

    setEditorState(newEditorState);
    setShowInputLink(false);
    setInputLinkValue("");
    setTimeout(() => editorRef.current && editorRef.current.focus(), 0);
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
    {
      icon: TextItalic,
      label: "Italic",
      style: "ITALIC",
      type: "inlineStyle",
    },
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
    {
      icon: CodeSimple,
      label: "Code",
      style: "CODE",
      type: "inlineStyle",
    },
    {
      type: "divide",
    },
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
    {
      icon: Code,
      label: "Code block",
      style: "code-block",
      type: "blockType",
    },
    {
      type: "divide",
    },
    {
      icon: LinkSimple,
      label: "Add link",
      type: "customAddLink",
    },
    {
      icon: LinkBreak,
      label: "Remove link",
      type: "customRemoveLink",
    },
  ];

  const handleClickEditorControl = ({ controlType, style }) => {
    switch (controlType) {
      case "inlineStyle":
        onChange(RichUtils.toggleInlineStyle(editorState, style));
        break;
      case "blockType":
        onChange(RichUtils.toggleBlockType(editorState, style));
        break;
      case "customAddLink":
        handleClickCustomAddLink();
        break;
      case "customRemoveLink":
        handleClickCustomRemoveLink();
        break;

      default:
        break;
    }
  };

  const EditorControl = ({ control, active }) => {
    return (
      <div className="relative">
        <CustomTooltip title={control.label}>
          <div
            className={clsx(
              "cursor-pointer p-1 border rounded-[8px]",
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
            <control.icon size={20} weight="light" />
          </div>
        </CustomTooltip>
        {showInputLink && control.type === "customAddLink" && (
          <div
            ref={inputLinkContainerRef}
            className="absolute left-1/2 -translate-x-1/2 z-[1] bg-primary-100 border p-4 rounded-[8px] mt-[5px]"
          >
            <div className="flex items-center gap-2">
              <label htmlFor="inputLink">Link</label>
              <input
                id="inputLink"
                ref={inputLinkRef}
                value={inputLinkValue}
                className="px-2 py-1 outline-none border border-primary-300 rounded-[8px] focus:border-primary-400"
                type="text"
                onChange={handleChangeInputLinkValue}
                onKeyDown={handleEnter}
              />
              <button
                className="px-2 py-1 border rounded-[8px]"
                onClick={handleAddLink}
              >
                Add
              </button>
            </div>
            {errorInputLink && (
              <div className="mt-2 text-center text-error">
                {errorInputLink}
              </div>
            )}

            <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-primary-300 transform"></div>
          </div>
        )}
      </div>
    );
  };

  const renderEditorControl = () => {
    return (
      <div className="p-2 border-b border-primary-300">
        <div className="flex gap-2">
          {EDITOR_CONTROLS.map((control, index) => {
            const checkActive = () => {
              if (control.type === "inlineStyle") {
                const currentStyle = editorState.getCurrentInlineStyle();
                return currentStyle.has(control.style);
              } else if (control.type === "blockType") {
                const selection = editorState.getSelection();
                const blockType = editorState
                  .getCurrentContent()
                  .getBlockForKey(selection.getStartKey())
                  .getType();
                return control.style === blockType;
              }
            };

            if (control.type === "divide") {
              return (
                <div
                  key={index}
                  className="w-0 border-r border-primary-300"
                ></div>
              );
            }

            return (
              <EditorControl
                key={index}
                control={control}
                active={checkActive()}
              />
            );
          })}
        </div>
        {error && <div className="text-error mt-2">{error}</div>}
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
      <div className="border border-primary-300 rounded-[8px] focus-within:border-primary-500">
        {renderEditorControl()}
        <div
          className={clsx("p-2 text-left overflow-y-auto")}
          style={{ minHeight: "300px", maxHeight: "300px" }}
          onClick={onFocus}
        >
          <Editor
            blockStyleFn={getBlockStyle}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={handleKeyBindingFn}
            onChange={onChange}
            placeholder={placeholder}
            ref={editorRef}
            blockRendererFn={(contentBlock) => {
              if (!contentBlock.getEntityAt(0)) return;
              const entity = editorState
                .getCurrentContent()
                .getEntity(contentBlock.getEntityAt(0));

              const entityType = entity.getType();
              return {
                component: CustomEntity,
                editable: entityType === CUSTOM_ENTITY.LINK ? true : false,
                props: {
                  onRemove: (blockKey) => {
                    const newState = deleteMediaBlock(blockKey, editorState);
                    newState && setEditorState(newState);
                  },
                },
              };
            }}
          />
        </div>
      </div>
    </div>
  );
}
