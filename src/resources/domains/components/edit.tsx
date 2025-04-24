import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  required,
} from "react-admin";

export const DomainEdit = () => {
  return (
    <Edit redirect="list" title="Edit Domain">
      <SimpleForm>
        <TextInput source="domain" validate={required()} />
        <TextInput source="alias" />
        <BooleanInput source="enabled" />
        <ArrayInput source="alternativeNames" label="Alternative Names">
          <SimpleFormIterator>
            <TextInput source="" />
          </SimpleFormIterator>
        </ArrayInput>
        <TextInput source="comment" multiline rows={4} />
      </SimpleForm>
    </Edit>
  );
};
