export class Profile {
  id: string;
  type = 'profile--user';
  attributes: Attributes;
  }

  export class Attributes {
    name: string;
    field_school: string;
    field_location: string;
    field_birthday: string;
    field_tagline: string;

    revision_id;
  }