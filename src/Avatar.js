import React from "react";

const Avatar = ({ mention, theme = {} }) => {
  if (mention.has("avatar")) {
    return (
      <img
        src={mention.get("avatar")}
        className={`${theme.mentionSuggestionsEntryAvatar} mention__avatar`}
        role="presentation"
      />
    );
  }

  return null;
};

export default Avatar;
