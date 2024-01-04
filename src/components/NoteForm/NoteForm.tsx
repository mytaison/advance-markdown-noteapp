import { FormEvent, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Stack,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ReactSelectCreatable from "react-select/creatable";
import { NoteData, Tag } from "../../App";
import { v4 as uuidv4 } from "uuid";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      title: titleRef.current?.value || "",
      markdown: markdownRef.current?.value || "",
      tags: selectedTags,
    });
    navigate("..");
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Row>
            <Col>
              <FormGroup controlId="title">
                <FormLabel>Title</FormLabel>
                <FormControl
                  required={true}
                  ref={titleRef}
                  defaultValue={title}
                ></FormControl>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup controlId="tags">
                <FormLabel>Tags</FormLabel>
                <ReactSelectCreatable
                  isMulti={true}
                  options={availableTags.map((tag) => {
                    return { label: tag.label, value: tag.id };
                  })}
                  value={selectedTags.map((tag) => {
                    return { label: tag.label, value: tag.id };
                  })}
                  onChange={(tags) => {
                    setSelectedTags(
                      tags.map((tag) => {
                        return { label: tag.label, id: tag.value };
                      })
                    );
                  }}
                  onCreateOption={(label) => {
                    const newTag = { id: uuidv4(), label };
                    onAddTag(newTag);
                    setSelectedTags((prevTags) => [...prevTags, newTag]);
                  }}
                ></ReactSelectCreatable>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup controlId="markdown">
            <FormLabel>Body</FormLabel>
            <FormControl
              required={true}
              as="textarea"
              rows={15}
              ref={markdownRef}
              defaultValue={markdown}
            ></FormControl>
          </FormGroup>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button type="submit" variant="outline-primary">
              Save
            </Button>
            <Link to={".."}>
              <Button type="button" variant="outline-secondary">
                Cancel
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Form>
    </>
  );
}
