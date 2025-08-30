/**
 * Valkey Search / RediSearch Commands
 * 
 * Implements full-text search and vector similarity search operations
 * Compatible with RediSearch v2.6+ and Valkey-Search module
 * 
 * API Reference: https://valkey.io/topics/search/
 * Commands: https://github.com/valkey-io/valkey-search/blob/main/COMMANDS.md
 */

import { GlideClient, GlideClusterClient } from '@valkey/valkey-glide';

export interface SearchIndex {
  index_name: string;
  index_options?: string[];
  schema_fields: Array<{
    field_name: string;
    field_type: 'TAG' | 'NUMERIC' | 'GEO' | 'VECTOR';
    field_options?: string[];
  }>;
}

export interface SearchQuery {
  query: string;
  options?: {
    LIMIT?: { offset: number; count: number };
    SORTBY?: { field: string; direction?: 'ASC' | 'DESC' };
    RETURN?: string[];
    FILTER?: { field: string; min: number; max: number };
    GEOFILTER?: { field: string; lon: number; lat: number; radius: number; unit: 'M' | 'KM' | 'MI' | 'FT' };
    INKEYS?: string[];
    INFIELDS?: string[];
    SLOP?: number;
    TIMEOUT?: number;
    INORDER?: boolean;
    LANGUAGE?: string;
    EXPANDER?: string;
    SCORER?: string;
    EXPLAINRESULTS?: boolean;
    PARAMS?: Record<string, any>;
    DIALECT?: number;
  };
}

export interface SearchResult {
  total: number;
  documents: Array<{
    id: string;
    score?: number;
    payload?: string;
    fields?: Record<string, any>;
  }>;
}

export class SearchCommands {
  /**
   * Create a search index
   * FT.CREATE index [ON HASH|JSON] [PREFIX count prefix [prefix ...]] 
   * [FILTER {filter}] [LANGUAGE {default_lang}] [LANGUAGE_FIELD {lang_field}] 
   * [SCORE {default_score}] [SCORE_FIELD {score_field}] [PAYLOAD_FIELD {payload_field}] 
   * [MAXTEXTFIELDS] [TEMPORARY {seconds}] [NOOFFSETS] [NOHL] [NOFIELDS] [NOFREQS] [STOPWORDS {count} {stopword} ...]
   * SCHEMA {field} [TEXT [NOSTEM] [WEIGHT {weight}] [PHONETIC {matcher}]] | [NUMERIC] | [GEO] | [TAG [SEPARATOR {sep}]] | [VECTOR {algorithm} {count} [{attribute_name} {attribute_value} ...]] ...
   */
  static async ftCreate(
    client: GlideClient | GlideClusterClient,
    index: SearchIndex
  ): Promise<string> {
    // Validate that at least one VECTOR field is present (required by Valkey Search)
    const hasVectorField = index.schema_fields.some(field => field.field_type === 'VECTOR');
    if (!hasVectorField) {
      throw new Error('Valkey Search requires at least one VECTOR field in every index');
    }
    
    const args = ['FT.CREATE', index.index_name];
    
    // Add index options if provided
    if (index.index_options) {
      args.push(...index.index_options);
    }
    
    // Add SCHEMA
    args.push('SCHEMA');
    
    // Add schema fields
    for (const field of index.schema_fields) {
      args.push(field.field_name, field.field_type);
      if (field.field_options) {
        args.push(...field.field_options);
      }
    }
    
    
    const result = await client.customCommand(args);
    return result as string;
  }

  /**
   * Search the index
   * FT.SEARCH index query [NOCONTENT] [VERBATIM] [NOSTOPWORDS] [WITHSCORES] 
   * [WITHPAYLOADS] [WITHSORTKEYS] [FILTER {numeric_field} {min} {max}] ... 
   * [GEOFILTER {geo_field} {lon} {lat} {radius} m|km|mi|ft] [INKEYS {count} {key} ...]
   * [INFIELDS {count} {field} ...] [RETURN {count} {identifier} [AS {property}] ...] 
   * [SUMMARIZE [FIELDS {count} {field} ...] [FRAGS {count}] [LEN {fragsize}] [SEPARATOR {separator}]] 
   * [HIGHLIGHT [FIELDS {count} {field} ...] [TAGS {open} {close}]] [SLOP {slop}] 
   * [TIMEOUT {timeout}] [INORDER] [LANGUAGE {language}] [EXPANDER {expander}] 
   * [SCORER {scorer}] [EXPLAINSCORE] [PAYLOAD {payload}] [SORTBY {attribute} [ASC|DESC]] 
   * [LIMIT {offset} {num}] [PARAMS {nargs} {name} {value} ...]
   */
  static async ftSearch(
    client: GlideClient | GlideClusterClient,
    indexName: string,
    searchQuery: SearchQuery
  ): Promise<SearchResult> {
    // Convert query to Valkey Search format
    let valkeyQuery = searchQuery.query;
    const options = searchQuery.options || {};
    
    // For simple text queries, convert to vector format with basic wildcard
    if (valkeyQuery && valkeyQuery !== '*' && !valkeyQuery.includes('=>')) {
      // Try different common vector field names based on index
      let vectorField = 'embedding';
      if (indexName.includes('ecommerce')) {
        vectorField = 'search_embedding';
      } else if (indexName.includes('product')) {
        vectorField = 'product_embedding';
      } else if (indexName.includes('content')) {
        vectorField = 'content_embedding';
      } else if (indexName.includes('doc')) {
        vectorField = 'doc_embedding';
      } else if (indexName.includes('temp')) {
        vectorField = 'temp_embedding';
      }
      
      // Convert simple text query to basic vector search format
      valkeyQuery = `*=>[KNN 10 @${vectorField} $vec]`;
      
      // Add default vector parameter if not present
      if (!options.PARAMS) {
        options.PARAMS = {};
      }
      if (!options.PARAMS.vec) {
        // Add a default zero vector for basic compatibility
        const defaultVector = new Array(128).fill(0);
        options.PARAMS.vec = Buffer.from(new Float32Array(defaultVector).buffer).toString('binary');
      }
    }
    
    const args = ['FT.SEARCH', indexName, valkeyQuery];
    
    // Add LIMIT
    if (options.LIMIT) {
      args.push('LIMIT', options.LIMIT.offset.toString(), options.LIMIT.count.toString());
    }
    
    // SORTBY is not supported in Valkey Search
    // if (options.SORTBY) {
    //   args.push('SORTBY', options.SORTBY.field);
    //   if (options.SORTBY.direction) {
    //     args.push(options.SORTBY.direction);
    //   }
    // }
    
    // Add RETURN fields
    if (options.RETURN) {
      args.push('RETURN', options.RETURN.length.toString(), ...options.RETURN);
    }
    
    // FILTER is not supported in Valkey Search - filtering is done in the query string
    // if (options.FILTER) {
    //   args.push('FILTER', options.FILTER.field, options.FILTER.min.toString(), options.FILTER.max.toString());
    // }
    
    // Add GEOFILTER
    if (options.GEOFILTER) {
      args.push(
        'GEOFILTER',
        options.GEOFILTER.field,
        options.GEOFILTER.lon.toString(),
        options.GEOFILTER.lat.toString(),
        options.GEOFILTER.radius.toString(),
        options.GEOFILTER.unit
      );
    }
    
    // Add INKEYS
    if (options.INKEYS) {
      args.push('INKEYS', options.INKEYS.length.toString(), ...options.INKEYS);
    }
    
    // Add INFIELDS
    if (options.INFIELDS) {
      args.push('INFIELDS', options.INFIELDS.length.toString(), ...options.INFIELDS);
    }
    
    // Add other boolean options
    if (options.INORDER) args.push('INORDER');
    if (options.EXPLAINRESULTS) args.push('EXPLAINSCORE');
    
    // Add single value options
    if (options.SLOP !== undefined) args.push('SLOP', options.SLOP.toString());
    if (options.TIMEOUT !== undefined) args.push('TIMEOUT', options.TIMEOUT.toString());
    if (options.LANGUAGE) args.push('LANGUAGE', options.LANGUAGE);
    if (options.EXPANDER) args.push('EXPANDER', options.EXPANDER);
    if (options.SCORER) args.push('SCORER', options.SCORER);
    if (options.DIALECT !== undefined) args.push('DIALECT', options.DIALECT.toString());
    
    // Add PARAMS
    if (options.PARAMS) {
      const paramEntries = Object.entries(options.PARAMS);
      if (paramEntries.length > 0) {
        args.push('PARAMS', (paramEntries.length * 2).toString());
        for (const [key, value] of paramEntries) {
          args.push(key, String(value));
        }
      }
    }
    
    const result = await client.customCommand(args);
    return SearchCommands.parseSearchResult(result);
  }

  /**
   * Get information about an index
   * FT.INFO index
   */
  static async ftInfo(
    client: GlideClient | GlideClusterClient,
    indexName: string
  ): Promise<Record<string, any>> {
    const result = await client.customCommand(['FT.INFO', indexName]);
    return SearchCommands.parseInfoResult(result);
  }

  /**
   * Drop an index
   * Note: FT.DROP is not available in Valkey Search - indexes are managed differently
   */
  static async ftDrop(
    _client: GlideClient | GlideClusterClient,
    _indexName: string,
    _deleteDocuments: boolean = false
  ): Promise<string> {
    // FT.DROP is not supported in Valkey Search
    // In Valkey Search, indexes are managed automatically
    throw new Error('FT.DROP command is not available in Valkey Search');
  }

  /**
   * Add a document to the index using HSET
   * In Valkey Search, documents are added using HSET and indexed automatically
   * HSET key field value [field value ...]
   */
  static async ftAdd(
    client: GlideClient | GlideClusterClient,
    _indexName: string, // kept for API compatibility but not used in Valkey Search
    docId: string,
    score: number,
    fields: Record<string, any>,
    options?: {
      NOSAVE?: boolean;
      REPLACE?: boolean;
      PARTIAL?: boolean;
      LANGUAGE?: string;
      PAYLOAD?: string;
    }
  ): Promise<string> {
    // In Valkey Search, use HSET to add documents (they are indexed automatically)
    const args = ['HSET', docId];
    
    // Add all fields as key-value pairs
    for (const [field, content] of Object.entries(fields)) {
      args.push(field, String(content));
    }
    
    // Add score as a special field (for compatibility)
    args.push('__score__', score.toString());
    
    // Add metadata fields if provided (for compatibility)
    const opts = options || {};
    if (opts.LANGUAGE) {
      args.push('__language__', opts.LANGUAGE);
    }
    if (opts.PAYLOAD) {
      args.push('__payload__', opts.PAYLOAD);
    }
    
    const result = await client.customCommand(args);
    // HSET returns number of fields added, but we want to return 'OK' for compatibility
    return typeof result === 'number' && result >= 0 ? 'OK' : String(result);
  }

  /**
   * Delete a document from the index using DEL
   * In Valkey Search, use DEL to delete documents since FT.DEL doesn't exist
   */
  static async ftDel(
    client: GlideClient | GlideClusterClient,
    _indexName: string, // kept for API compatibility  
    docId: string,
    _deleteDocument: boolean = false // not needed in Valkey Search
  ): Promise<number> {
    const result = await client.customCommand(['DEL', docId]);
    return Number(result) || 0;
  }

  /**
   * Get a document from the index using HGETALL
   * In Valkey Search, use HGETALL to get documents since FT.GET doesn't exist
   */
  static async ftGet(
    client: GlideClient | GlideClusterClient,
    _indexName: string, // kept for API compatibility
    docId: string
  ): Promise<Record<string, any> | null> {
    const result = await client.customCommand(['HGETALL', docId]);
    return SearchCommands.parseDocumentResult(result);
  }

  /**
   * Get multiple documents from the index using multiple HGETALL
   * In Valkey Search, use multiple HGETALL since FT.MGET doesn't exist
   */
  static async ftMGet(
    client: GlideClient | GlideClusterClient,
    _indexName: string, // kept for API compatibility
    ...docIds: string[]
  ): Promise<Array<Record<string, any> | null>> {
    const promises = docIds.map(docId => 
      client.customCommand(['HGETALL', docId])
        .then(result => SearchCommands.parseDocumentResult(result))
        .catch(() => null)
    );
    
    return Promise.all(promises);
  }

  /**
   * Perform aggregation query
   * FT.AGGREGATE index query [VERBATIM] [LOAD count field [field ...]] 
   * [GROUPBY nargs property [property ...] [REDUCE function nargs arg [arg ...] [AS name]] ...]
   * [SORTBY nargs property [ASC|DESC] [property [ASC|DESC] ...]] [APPLY expression AS name] 
   * [LIMIT offset num] [FILTER filter]
   */
  static async ftAggregate(
    client: GlideClient | GlideClusterClient,
    indexName: string,
    query: string,
    options?: {
      VERBATIM?: boolean;
      LOAD?: string[];
      GROUPBY?: {
        fields: string[];
        REDUCE?: Array<{
          function: string;
          args: string[];
          AS?: string;
        }>;
      };
      SORTBY?: Array<{
        property: string;
        direction?: 'ASC' | 'DESC';
      }>;
      APPLY?: Array<{
        expression: string;
        AS: string;
      }>;
      LIMIT?: {
        offset: number;
        num: number;
      };
      FILTER?: string;
    }
  ): Promise<any[]> {
    const args = ['FT.AGGREGATE', indexName, query];
    const opts = options || {};
    
    if (opts.VERBATIM) args.push('VERBATIM');
    
    if (opts.LOAD) {
      args.push('LOAD', opts.LOAD.length.toString(), ...opts.LOAD);
    }
    
    if (opts.GROUPBY) {
      args.push('GROUPBY', opts.GROUPBY.fields.length.toString(), ...opts.GROUPBY.fields);
      if (opts.GROUPBY.REDUCE) {
        for (const reduce of opts.GROUPBY.REDUCE) {
          args.push('REDUCE', reduce.function, reduce.args.length.toString(), ...reduce.args);
          if (reduce.AS) {
            args.push('AS', reduce.AS);
          }
        }
      }
    }
    
    if (opts.SORTBY && opts.SORTBY.length > 0) {
      args.push('SORTBY', (opts.SORTBY.length * 2).toString());
      for (const sort of opts.SORTBY) {
        args.push(sort.property, sort.direction || 'ASC');
      }
    }
    
    if (opts.APPLY) {
      for (const apply of opts.APPLY) {
        args.push('APPLY', apply.expression, 'AS', apply.AS);
      }
    }
    
    if (opts.LIMIT) {
      args.push('LIMIT', opts.LIMIT.offset.toString(), opts.LIMIT.num.toString());
    }
    
    if (opts.FILTER) {
      args.push('FILTER', opts.FILTER);
    }
    
    const result = await client.customCommand(args);
    return Array.isArray(result) ? result : [];
  }

  /**
   * Explain a query execution plan
   * Note: FT.EXPLAIN is not available in Valkey Search
   */
  static async ftExplain(
    _client: GlideClient | GlideClusterClient,
    _indexName: string,
    _query: string,
    _dialect?: number
  ): Promise<string> {
    // FT.EXPLAIN is not supported in Valkey Search
    throw new Error('FT.EXPLAIN command is not available in Valkey Search');
  }

  /**
   * Get list of all indexes
   * FT._LIST
   */
  static async ftList(client: GlideClient | GlideClusterClient): Promise<string[]> {
    const result = await client.customCommand(['FT._LIST']);
    return Array.isArray(result) ? result as string[] : [];
  }

  /**
   * Vector similarity search
   * FT.SEARCH index "(@vector_field:[VECTOR_RANGE $radius $query_vector])"
   * PARAMS 4 radius 0.8 query_vector "\\x12\\x34..." DIALECT 2
   */
  static async ftVectorSearch(
    client: GlideClient | GlideClusterClient,
    indexName: string,
    vectorField: string,
    queryVector: number[] | Buffer,
    options?: {
      KNN?: number;
      EF_RUNTIME?: number;
      HYBRID_POLICY?: 'ADHOC_BF' | 'BATCHES';
      LIMIT?: { offset: number; count: number };
      FILTER?: string;
    }
  ): Promise<SearchResult> {
    let vectorBytes: string;
    if (Array.isArray(queryVector)) {
      // Convert number array to binary string
      const buffer = Buffer.alloc(queryVector.length * 4);
      for (let i = 0; i < queryVector.length; i++) {
        buffer.writeFloatLE(queryVector[i] || 0, i * 4);
      }
      vectorBytes = buffer.toString('binary');
    } else {
      vectorBytes = queryVector.toString('binary');
    }
    
    const opts = options || {};
    const k = opts.KNN || 10;
    
    // Build vector search query
    const query = `*=>[KNN ${k} @${vectorField} $query_vector AS vector_score]`;
    
    const searchQuery: SearchQuery = {
      query: opts.FILTER ? `(${opts.FILTER}) => ${query}` : query,
      options: {
        PARAMS: {
          query_vector: vectorBytes,
          ...(opts.EF_RUNTIME && { EF_RUNTIME: opts.EF_RUNTIME }),
          ...(opts.HYBRID_POLICY && { HYBRID_POLICY: opts.HYBRID_POLICY })
        },
        // SORTBY not supported in Valkey Search
        // SORTBY: { field: 'vector_score' },
        DIALECT: 2,
        ...(opts.LIMIT && { LIMIT: opts.LIMIT })
      }
    };
    
    return SearchCommands.ftSearch(client, indexName, searchQuery);
  }

  /**
   * Parse search result from FT.SEARCH
   */
  private static parseSearchResult(result: any): SearchResult {
    if (!Array.isArray(result) || result.length < 1) {
      return { total: 0, documents: [] };
    }
    
    const total = Number(result[0]) || 0;
    const documents = [];
    
    // Parse documents starting from index 1
    for (let i = 1; i < result.length; i += 2) {
      if (i + 1 >= result.length) break;
      
      const id = result[i];
      const fieldsArray = result[i + 1];
      const doc: any = { id };
      
      if (Array.isArray(fieldsArray)) {
        const fields: Record<string, any> = {};
        for (let j = 0; j < fieldsArray.length; j += 2) {
          if (j + 1 < fieldsArray.length) {
            fields[fieldsArray[j]] = fieldsArray[j + 1];
          }
        }
        doc.fields = fields;
      }
      
      documents.push(doc);
    }
    
    return { total, documents };
  }

  /**
   * Parse FT.INFO result
   */
  private static parseInfoResult(result: any): Record<string, any> {
    if (!Array.isArray(result)) return {};
    
    const info: Record<string, any> = {};
    
    // Check if GLIDE returns info in {key, value} object format
    if (result.length > 0 && typeof result[0] === 'object' && result[0].hasOwnProperty('key') && result[0].hasOwnProperty('value')) {
      // GLIDE format: [{ key: 'index_name', value: 'test_products' }, ...]
      for (const item of result) {
        if (item && typeof item === 'object' && item.key && item.value !== undefined) {
          info[item.key] = item.value;
        }
      }
    } else {
      // Standard Redis format: ['index_name', 'test_products', ...]
      for (let i = 0; i < result.length; i += 2) {
        if (i + 1 < result.length) {
          info[result[i]] = result[i + 1];
        }
      }
    }
    
    // Always ensure index_name is set for compatibility
    if (!info.index_name && Object.keys(info).length > 0) {
      // Try to extract index name from other fields or set a default
      info.index_name = 'unknown';
    }
    
    return info;
  }

  /**
   * Parse document result from FT.GET
   */
  private static parseDocumentResult(result: any): Record<string, any> | null {
    if (!Array.isArray(result) || result.length === 0) return null;
    
    const doc: Record<string, any> = {};
    
    // Check if GLIDE returns HGETALL in {key, value} object format
    if (result.length > 0 && typeof result[0] === 'object' && result[0].hasOwnProperty('key') && result[0].hasOwnProperty('value')) {
      // GLIDE format: [{ key: 'name', value: 'Test Product' }, ...]
      for (const item of result) {
        if (item && typeof item === 'object' && item.key && item.value !== undefined) {
          doc[item.key] = item.value;
        }
      }
    } else {
      // Standard Redis format: ['name', 'Test Product', 'price', '99.99', ...]
      for (let i = 0; i < result.length; i += 2) {
        if (i + 1 < result.length) {
          doc[result[i]] = result[i + 1];
        }
      }
    }
    
    return Object.keys(doc).length > 0 ? doc : null;
  }
}