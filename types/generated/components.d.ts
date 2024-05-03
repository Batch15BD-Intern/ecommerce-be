import type { Schema, Attribute } from '@strapi/strapi';

export interface ElementsBannerItem extends Schema.Component {
  collectionName: 'components_elements_banner_items';
  info: {
    displayName: 'Banner Item';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    start_time: Attribute.DateTime;
    end_time: Attribute.DateTime;
    link: Attribute.String;
    image: Attribute.Media & Attribute.Required;
  };
}

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
      'elements.banner-item': ElementsBannerItem;
      'elements.ceo': ElementsCeo;
      'elements.journey': ElementsJourney;
    }
  }
}
