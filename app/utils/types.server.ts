export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  firstName: string;
  lastName: string;
}

export interface ActionData {
  error?: string;
  errors?: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  };
  fields?: RegisterForm;
  form?: string;
}

/**
 * Overpass API types inspired by {@link https://github.com/1papaya/overpass-ts}
 */

export interface OverpassJson {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    timestamp_areas_base?: string;
    copyright: string;
  };
  elements: Array<
    | OverpassNode
    | OverpassWay
    | OverpassRelation
    | OverpassArea
    | OverpassTimeline
    | OverpassCount
  >;
  remark?: string;
}

export interface OverpassElement {
  type: "node" | "way" | "relation" | "area" | "timeline" | "count";
  id: number;
}

export interface OverpassOsmElement extends OverpassElement {
  type: "node" | "way" | "relation";
  timestamp?: string;
  version?: number;
  changeset?: number;
  user?: string;
  uid?: number;
  tags?: {
    [key: string]: string;
  };
}

export interface OverpassNode extends OverpassOsmElement {
  type: "node";
  lat: number;
  lon: number;
}

export interface OverpassWay extends OverpassOsmElement {
  type: "way";
  nodes: number[];
  center?: OverpassPointGeom;
  bounds?: OverpassBbox;
  geometry?: OverpassPointGeom[];
}

export interface OverpassRelation extends OverpassOsmElement {
  type: "relation";
  members: OverpassRelationMember[];
  center?: OverpassPointGeom;
  bounds?: OverpassBbox;
  geometry?: OverpassPointGeom[];
}

export interface OverpassRelationMember {
  type: "node" | "way" | "relation";
  ref: number;
  role: string;

  // Relation Node Members in `out geom;` have lon/lats
  lon?: number;
  lat?: number;

  // Relation Way Members in `out geom;` have point geoms
  geometry?: OverpassPointGeom[];
}

export interface OverpassArea extends OverpassElement {
  type: "area";
  tags: { [key: string]: string };
}

export interface OverpassTimeline extends OverpassElement {
  type: "timeline";
  tags: {
    reftype: string;
    ref: string;
    refversion: string;
    created: string;
    expired?: string;
  };
}

export interface OverpassCount extends OverpassElement {
  type: "count";
  tags: {
    nodes: string;
    ways: string;
    relations: string;
    total: string;
  };
}

export interface OverpassPointGeom {
  lat: number;
  lon: number;
}

export interface OverpassBbox {
  minlat: number;
  minlon: number;
  maxlat: number;
  maxlon: number;
}
