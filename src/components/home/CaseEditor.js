import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./CaseEditor.scss";
import ErrorMessage from "../misc/ErrorMessage";
import domain from "../../util/domain";

function CaseEditor({ getCases, setCaseEditorOpen, editCaseData }) {
  const [editorTitle, setEditorTitle] = useState("");
  const [editorDescription, setEditorDescription] = useState("");
  const [editorCode, setEditorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (editCaseData) {
      setEditorTitle(editCaseData.title ? editCaseData.title : "");
      setEditorDescription(
        editCaseData.description ? editCaseData.description : ""
      );
      setEditorCode(editCaseData.code ? editCaseData.code : "");
    }
  }, [editCaseData]);

  async function saveCase(e) {
    e.preventDefault();

    const caseData = {
      title: editorTitle ? editorTitle : undefined,
      description: editorDescription ? editorDescription : undefined,
      code: editorCode ? editorCode : undefined,
    };

    try {
      if (!editCaseData) await Axios.post(`${domain}/case/`, caseData);
      else
        await Axios.put(
          `${domain}/case/${editCaseData._id}`,
          caseData
        );
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          setErrorMessage(err.response.data.errorMessage);
        }
      }
      return;
    }

    getCases();
    closeEditor();
  }

  function closeEditor() {
    setCaseEditorOpen(false);
    setEditorCode("");
    setEditorDescription("");
    setEditorTitle("");
  }

  return (
    <div className="case-editor">
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          clear={() => setErrorMessage(null)}
        />
      )}
      <form className="form" onSubmit={saveCase}>
        <label htmlFor="editor-title">Title</label>
        <input
          id="editor-title"
          type="text"
          value={editorTitle}
          onChange={(e) => setEditorTitle(e.target.value)}
        />

        <label htmlFor="editor-description">Description</label>
        <input
          id="editor-description"
          type="text"
          value={editorDescription}
          onChange={(e) => setEditorDescription(e.target.value)}
        />

        <label htmlFor="editor-code">Code</label>
        <textarea
          id="editor-code"
          value={editorCode}
          onChange={(e) => setEditorCode(e.target.value)}
        />

        <button className="btn-save" type="submit">
          Save
        </button>
        <button className="btn-cancel" type="button" onClick={closeEditor}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CaseEditor;