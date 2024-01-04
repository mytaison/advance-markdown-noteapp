import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import { NewNote } from "./components/NewNote/NewNote";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { NoteList } from "./components/NoteList/NoteList";
import { NoteLayout } from "./components/NoteLayout/NoteLayout";
import { Note } from "./components/Note/Note";
import { EditNote } from "./components/EditNote/EditNote";

export type RawNote = {
  id: string;
} & RawNoteData;
export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};
export type Note = {
  id: string;
} & NoteData;
export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};
export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);
  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);
  console.log(notes);
  console.log(tags);
  console.log(notesWithTags);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((previousNotes) => {
      return [
        ...previousNotes,
        { ...data, id: uuidv4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((previousNotes) => {
      return previousNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  function onDeleteNote(id: string) {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }

  function addTag(tag: Tag) {
    setTags((prevTags) => [...prevTags, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) =>
      prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label: label };
        }
        return tag;
      })
    );
  }

  function deleteTag(id: string) {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  }

  console.log(
    "Note Filtering",
    notesWithTags.filter(
      (note) => note.id === "9278c6cd-8c16-4d3c-8f9a-c99f8ec047f0"
    )
  );
  return (
    <Container className="my-4">
      <Routes>
        {/* Redirect to Home Page for invalid routes */}
        <Route path="*" element={<Navigate to={"/"} />}></Route>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <NoteList
              availableTags={tags}
              notes={notesWithTags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            ></NoteList>
          }
        ></Route>
        {/* Note Related Routes */}
        <Route
          path="/:id"
          element={<NoteLayout notes={notesWithTags}></NoteLayout>}
          // element={<NoteLayout notes={getNoteById(`$(:id)`)}></NoteLayout>}
        >
          {/* Note Show Route */}
          <Route index element={<Note onDelete={onDeleteNote}></Note>}></Route>
          {/* Note Edit Route */}
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              ></EditNote>
            }
          ></Route>
        </Route>
        {/* New Note Route */}
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            ></NewNote>
          }
        ></Route>
      </Routes>
    </Container>
  );
}

export default App;
