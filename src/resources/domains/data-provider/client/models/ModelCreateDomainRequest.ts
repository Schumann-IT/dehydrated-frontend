/* tslint:disable */
/* eslint-disable */
/**
 * Dehydrated API
 * Authentication is optional and depends on server configuration. When enabled, all API endpoints require a valid JWT token in the Authorization header. When disabled, no authentication is required.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * Request to create a new domain entry
 * @export
 * @interface ModelCreateDomainRequest
 */
export interface ModelCreateDomainRequest {
    /**
     * Alias is an optional alternative identifier.
     * @Description Optional alternative identifier for the domain
     * @type {string}
     * @memberof ModelCreateDomainRequest
     */
    alias?: string;
    /**
     * AlternativeNames is a list of additional domain names.
     * @Description List of additional domain names (e.g., "www.example.com")
     * @type {Array<string>}
     * @memberof ModelCreateDomainRequest
     */
    alternativeNames?: Array<string>;
    /**
     * Comment is an optional description.
     * @Description Optional description or comment for the domain
     * @type {string}
     * @memberof ModelCreateDomainRequest
     */
    comment?: string;
    /**
     * Domain is the primary domain name (required).
     * @Description Primary domain name (required)
     * @required
     * @type {string}
     * @memberof ModelCreateDomainRequest
     */
    domain: string;
    /**
     * Enabled indicates whether the domain should be active.
     * @Description Whether the domain is enabled for certificate issuance
     * @type {boolean}
     * @memberof ModelCreateDomainRequest
     */
    enabled?: boolean;
}

/**
 * Check if a given object implements the ModelCreateDomainRequest interface.
 */
export function instanceOfModelCreateDomainRequest(value: object): value is ModelCreateDomainRequest {
    if (!('domain' in value) || value['domain'] === undefined) return false;
    return true;
}

export function ModelCreateDomainRequestFromJSON(json: any): ModelCreateDomainRequest {
    return ModelCreateDomainRequestFromJSONTyped(json, false);
}

export function ModelCreateDomainRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelCreateDomainRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'alias': json['alias'] == null ? undefined : json['alias'],
        'alternativeNames': json['alternative_names'] == null ? undefined : json['alternative_names'],
        'comment': json['comment'] == null ? undefined : json['comment'],
        'domain': json['domain'],
        'enabled': json['enabled'] == null ? undefined : json['enabled'],
    };
}

export function ModelCreateDomainRequestToJSON(json: any): ModelCreateDomainRequest {
    return ModelCreateDomainRequestToJSONTyped(json, false);
}

export function ModelCreateDomainRequestToJSONTyped(value?: ModelCreateDomainRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'alias': value['alias'],
        'alternative_names': value['alternativeNames'],
        'comment': value['comment'],
        'domain': value['domain'],
        'enabled': value['enabled'],
    };
}

