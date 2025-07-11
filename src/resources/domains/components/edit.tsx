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
        <TextInput
          source="domain"
          validate={required()}
          label="Domain"
          disabled
        />
        <TextInput
          source="alias"
          label="Alias (Read-only)"
          disabled
          helperText="Alias cannot be changed after creation"
        />
        <BooleanInput source="enabled" label="Enabled" />
        <ArrayInput source="alternativeNames" label="Alternative Names">
          <SimpleFormIterator>
            <TextInput source="" />
          </SimpleFormIterator>
        </ArrayInput>
        <TextInput source="comment" multiline rows={4} label="Comment" />
      </SimpleForm>
    </Edit>
  );
};
