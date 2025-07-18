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
 * Pagination metadata for responses
 * @export
 * @interface ModelPaginationInfo
 */
export interface ModelPaginationInfo {
    /**
     * CurrentPage is the current page number (1-based)
     * @Description Current page number (1-based)
     * @type {number}
     * @memberof ModelPaginationInfo
     */
    currentPage?: number;
    /**
     * HasNext indicates if there is a next page
     * @Description Whether there is a next page
     * @type {boolean}
     * @memberof ModelPaginationInfo
     */
    hasNext?: boolean;
    /**
     * HasPrev indicates if there is a previous page
     * @Description Whether there is a previous page
     * @type {boolean}
     * @memberof ModelPaginationInfo
     */
    hasPrev?: boolean;
    /**
     * NextURL is the URL for the next page
     * @Description URL for the next page
     * @type {string}
     * @memberof ModelPaginationInfo
     */
    nextUrl?: string;
    /**
     * PerPage is the number of items per page
     * @Description Number of items per page
     * @type {number}
     * @memberof ModelPaginationInfo
     */
    perPage?: number;
    /**
     * PrevURL is the URL for the previous page
     * @Description URL for the previous page
     * @type {string}
     * @memberof ModelPaginationInfo
     */
    prevUrl?: string;
    /**
     * Total is the total number of items
     * @Description Total number of items
     * @type {number}
     * @memberof ModelPaginationInfo
     */
    total?: number;
    /**
     * TotalPages is the total number of pages
     * @Description Total number of pages
     * @type {number}
     * @memberof ModelPaginationInfo
     */
    totalPages?: number;
}

/**
 * Check if a given object implements the ModelPaginationInfo interface.
 */
export function instanceOfModelPaginationInfo(value: object): value is ModelPaginationInfo {
    return true;
}

export function ModelPaginationInfoFromJSON(json: any): ModelPaginationInfo {
    return ModelPaginationInfoFromJSONTyped(json, false);
}

export function ModelPaginationInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelPaginationInfo {
    if (json == null) {
        return json;
    }
    return {
        
        'currentPage': json['current_page'] == null ? undefined : json['current_page'],
        'hasNext': json['has_next'] == null ? undefined : json['has_next'],
        'hasPrev': json['has_prev'] == null ? undefined : json['has_prev'],
        'nextUrl': json['next_url'] == null ? undefined : json['next_url'],
        'perPage': json['per_page'] == null ? undefined : json['per_page'],
        'prevUrl': json['prev_url'] == null ? undefined : json['prev_url'],
        'total': json['total'] == null ? undefined : json['total'],
        'totalPages': json['total_pages'] == null ? undefined : json['total_pages'],
    };
}

export function ModelPaginationInfoToJSON(json: any): ModelPaginationInfo {
    return ModelPaginationInfoToJSONTyped(json, false);
}

export function ModelPaginationInfoToJSONTyped(value?: ModelPaginationInfo | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'current_page': value['currentPage'],
        'has_next': value['hasNext'],
        'has_prev': value['hasPrev'],
        'next_url': value['nextUrl'],
        'per_page': value['perPage'],
        'prev_url': value['prevUrl'],
        'total': value['total'],
        'total_pages': value['totalPages'],
    };
}

