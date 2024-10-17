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
  YoutubeLogo,
  Image,
} from "phosphor-react";

export const CUSTOM_ENTITY = {
  LINK: "LINK",
  EMBED: "EMBED",
  VIDEO: "VIDEO",
  IMAGE: "IMAGE",
  FILE: "FILE",
};

export const CONTROL_TYPE = {
  inlineStyle: "inlineStyle",
  blockType: "blockType",
  customAddLink: "customAddLink",
  customRemoveLink: "customRemoveLink",
  customEmbed: "customEmbed",
  customUploadImage: "customUploadImage",
};

export const EDITOR_CONTROLS = [
  {
    icon: TextBolder,
    label: "Bold / Ctrl + B",
    style: "BOLD",
    type: CONTROL_TYPE.inlineStyle,
  },
  {
    icon: TextItalic,
    label: "Italic / Ctrl + I",
    style: "ITALIC",
    type: CONTROL_TYPE.inlineStyle,
  },
  {
    icon: TextUnderline,
    label: "Underline / Ctrl + U",
    style: "UNDERLINE",
    type: CONTROL_TYPE.inlineStyle,
  },
  {
    icon: TextStrikethrough,
    label: "Strikethrough",
    style: "STRIKETHROUGH",
    type: CONTROL_TYPE.inlineStyle,
  },
  {
    icon: CodeSimple,
    label: "Code",
    style: "CODE",
    type: CONTROL_TYPE.inlineStyle,
  },
  {
    type: "divide",
  },
  {
    icon: TextAlignLeft,
    label: "Text left",
    style: "left",
    type: CONTROL_TYPE.blockType,
  },
  {
    icon: TextAlignCenter,
    label: "Text center",
    style: "center",
    type: CONTROL_TYPE.blockType,
  },
  {
    icon: TextAlignRight,
    label: "Text right",
    style: "right",
    type: CONTROL_TYPE.blockType,
  },
  {
    icon: ListBullets,
    label: "Unordered list",
    style: "unordered-list-item",
    type: CONTROL_TYPE.blockType,
  },
  {
    icon: ListNumbers,
    label: "Ordered list",
    style: "ordered-list-item",
    type: CONTROL_TYPE.blockType,
  },
  {
    icon: Quotes,
    label: "Blockquote",
    style: "blockquote",
    type: CONTROL_TYPE.blockType,
  },
  {
    icon: Code,
    label: "Code block",
    style: "code-block",
    type: CONTROL_TYPE.blockType,
  },
  {
    type: "divide",
  },
  {
    icon: LinkSimple,
    label: "Add link",
    type: CONTROL_TYPE.customAddLink,
  },
  {
    icon: LinkBreak,
    label: "Remove link",
    type: CONTROL_TYPE.customRemoveLink,
  },
  {
    icon: YoutubeLogo,
    label: "Embed",
    type: CONTROL_TYPE.customEmbed,
  },
  {
    icon: Image,
    label: "Upload image",
    type: CONTROL_TYPE.customUploadImage,
  },
];

export const ACCEPT_FILE_IMAGE = "image/png, image/gif, image/jpeg, image/webp";

export const SIZE_10MB = 10 * 1024 * 1024;
export const MAX_UPLOAD_IMAGE = 5;

export const isLink = (str) => {
  const pattern =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

  return !!pattern.test(str);
};

export const isYoutubeEmbed = (str) => {
  const pattern =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

  return !!pattern.test(str);
};

export const getEntitiesByType = (editorState, entityType) => {
  const contentState = editorState.getCurrentContent();
  const entities = [];

  contentState.getBlockMap().forEach((block) => {
    block?.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        const entity = entityKey ? contentState.getEntity(entityKey) : null;
        return entity !== null && entityType.includes(entity.getType());
      },
      (start) => {
        const entityKey = block.getEntityAt(start);
        const entity = contentState.getEntity(entityKey);
        entities.push(entity);
      }
    );
  });

  return entities;
};
