import type { Schema, Attribute } from '@strapi/strapi';

export interface ElementsCeo extends Schema.Component {
  collectionName: 'components_ceo_ceos';
  info: {
    displayName: 'CEO';
    description: '';
  };
  attributes: {
    contents: Attribute.Text;
    name: Attribute.String;
  };
}

export interface ElementsJourney extends Schema.Component {
  collectionName: 'components_journey_journeys';
  info: {
    displayName: 'Journey';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    image: Attribute.Media;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'elements.ceo': ElementsCeo;
      'elements.journey': ElementsJourney;
    }
  }
}
