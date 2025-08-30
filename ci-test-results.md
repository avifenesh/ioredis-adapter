Run npm test

> valkey-glide-ioredis-adapter@0.3.0 test
> jest

2025-08-30T09:59:02.260228Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: Invalid stream ID specified as stream command argument
PASS tests/unit/stream-commands.test.ts
  Stream Commands - Event Sourcing & Microservices
    Event Sourcing Patterns
      ✓ should implement user action event streaming with XADD (23 ms)
      ✓ should read event stream with XREAD for replay (11 ms)
      ✓ should implement aggregate rebuilding from event stream (8 ms)
    Microservices Communication Patterns
      ✓ should implement order processing workflow across services (15 ms)
      ✓ should implement saga pattern for distributed transactions (11 ms)
      ✓ should implement event-driven notification system (12 ms)
    Real-Time Analytics & Monitoring
      ✓ should track application metrics in real-time (7 ms)
      ✓ should implement user activity analytics (9 ms)
    Stream Management & Cleanup
      ✓ should implement stream trimming for memory management (15 ms)
      ✓ should handle stream range queries for time-based analysis (14 ms)
    Stream Consumer Groups - Production Message Delivery
      ✓ should implement reliable message processing with consumer groups (9 ms)
      ✓ should handle consumer group scaling patterns like Kafka (19 ms)
      ✓ should implement dead letter queue pattern for failed messages (6 ms)
      ✓ should implement consumer group monitoring and rebalancing (13 ms)
      ✓ should handle consumer failure recovery patterns (8 ms)
      ✓ should implement multi-tenant message isolation (13 ms)
    Error Handling and Edge Cases
      ✓ should handle operations on non-existent streams (8 ms)
      ✓ should handle malformed stream operations gracefully (5 ms)
      ✓ should handle large stream entries efficiently (5 ms)

PASS tests/integration/message-queues/bull-bee-queue.test.ts (5.902 s)
  Message Queue Systems Integration
    Bull Queue Integration
      ✓ should create and process simple jobs (110 ms)
      ✓ should handle job delays (213 ms)
      ✓ should handle job priorities (41 ms)
      ✓ should handle job failures and retries (260 ms)
      ✓ should provide job statistics (127 ms)
    Bee-Queue Integration
      ✓ should create and process jobs with Bee-queue (25 ms)
      ✓ should handle job delays with Bee-queue (3514 ms)
      ✓ should handle job failures with Bee-queue (17 ms)
      ✓ should provide health check capabilities (14 ms)
    Performance Comparison
      ✓ should handle high-throughput job creation (36 ms)
      ✓ should handle concurrent queue operations (14 ms)
    Advanced Bull Integration - defineCommand & createClient
      ✓ should support defineCommand for custom Lua scripts (11 ms)
      ✓ should integrate with Bull using createClient option (529 ms)
      ✓ should demonstrate Bull can access custom commands through our adapter (33 ms)

  console.log
    ✅ Valkey-bundle is ready with supported modules: { json: true, search: true }

      at waitForValkeyBundle (tests/utils/valkey-bundle-config.ts:142:17)

2025-08-30T09:59:08.944040Z  WARN logger_core: received error - Invalid: field type for field `AS`: Unknown argument `title`
  console.warn
    JSON indexing not supported: Invalid: field type for field `AS`: Unknown argument `title`

      147 |         } else {
      148 |           // JSON indexing might not be supported in all environments
    > 149 |           console.warn('JSON indexing not supported:', error.message);
          |                   ^
      150 |         }
      151 |       }
      152 |     });

      at Object.<anonymous> (tests/unit/search-commands.test.ts:149:19)

2025-08-30T09:59:09.057866Z  WARN logger_core: received error - Index: test_products already exists.
2025-08-30T09:59:09.391339Z  WARN logger_core: received error - timed out
2025-08-30T09:59:09.391385Z  WARN logger_core: received error - timed out
2025-08-30T09:59:10.092867Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: unknown command 'FT.AGGREGATE', with args beginning with: 'test_ecommerce' '*' 'GROUPBY' '1' '@category' 'REDUCE' 'COUNT' '0' 'AS' 'product_count' 'SORTBY' '2' '@product_count' 'DESC' 
  console.warn
    Aggregation not supported: RequestError: An error was signalled by the server: - ResponseError: unknown command 'FT.AGGREGATE', with args beginning with: 'test_ecommerce' '*' 'GROUPBY' '1' '@category' 'REDUCE' 'COUNT' '0' 'AS' 'product_count' 'SORTBY' '2' '@product_count' 'DESC' 
        at GlideClient.processResponse (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:356:20)
        at GlideClient.handleReadData (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
        at Socket.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
        at Socket.emit (node:events:524:28)
        at addChunk (node:internal/streams/readable:561:12)
        at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
        at Socket.Readable.push (node:internal/streams/readable:392:5)
        at Pipe.onStreamRead (node:internal/stream_base_commons:191:23)

      527 |       } catch (error) {
      528 |         // Aggregation might not be supported in all environments
    > 529 |         console.warn('Aggregation not supported:', error);
          |                 ^
      530 |       }
      531 |     });
      532 |

      at Object.<anonymous> (tests/unit/search-commands.test.ts:529:17)

2025-08-30T09:59:10.205673Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: unknown command 'FT.AGGREGATE', with args beginning with: 'test_ecommerce' '*' 'GROUPBY' '1' '@brand' 'REDUCE' 'COUNT' '0' 'AS' 'product_count' 'REDUCE' 'AVG' '1' '@price' 'AS' 'avg_price' 
  console.warn
    Complex aggregation not supported: RequestError: An error was signalled by the server: - ResponseError: unknown command 'FT.AGGREGATE', with args beginning with: 'test_ecommerce' '*' 'GROUPBY' '1' '@brand' 'REDUCE' 'COUNT' '0' 'AS' 'product_count' 'REDUCE' 'AVG' '1' '@price' 'AS' 'avg_price' 
        at GlideClient.processResponse (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:356:20)
        at GlideClient.handleReadData (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
        at Socket.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
        at Socket.emit (node:events:524:28)
        at addChunk (node:internal/streams/readable:561:12)
        at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
        at Socket.Readable.push (node:internal/streams/readable:392:5)
        at Pipe.onStreamRead (node:internal/stream_base_commons:191:23)

      561 |         
      562 |       } catch (error) {
    > 563 |         console.warn('Complex aggregation not supported:', error);
          |                 ^
      564 |       }
      565 |     });
      566 |   });

      at Object.<anonymous> (tests/unit/search-commands.test.ts:563:17)

2025-08-30T09:59:10.315654Z  WARN logger_core: received error - Error: parsing vector similarity query: query vector blob size (21) does not match index's expected size (16).
  console.warn
    Vector search not supported: RequestError: Error: parsing vector similarity query: query vector blob size (21) does not match index's expected size (16).
        at GlideClient.processResponse (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:356:20)
        at GlideClient.handleReadData (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
        at Socket.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
        at Socket.emit (node:events:524:28)
        at addChunk (node:internal/streams/readable:561:12)
        at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
        at Socket.Readable.push (node:internal/streams/readable:392:5)
        at Pipe.onStreamRead (node:internal/stream_base_commons:191:23)

      622 |       } catch (error) {
      623 |         // Vector search might not be supported in all environments
    > 624 |         console.warn('Vector search not supported:', error);
          |                 ^
      625 |       }
      626 |     });
      627 |   });

      at Object.<anonymous> (tests/unit/search-commands.test.ts:624:17)

2025-08-30T09:59:10.627005Z  WARN logger_core: received error - Index: with name 'nonexistent_index' not found
  console.warn
    Query explanation not supported: Error: FT.EXPLAIN command is not available in Valkey Search
        at Function.ftExplain (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/commands/SearchCommands.ts:431:11)
        at RedisAdapter.ftExplain (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2555:27)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/unit/search-commands.test.ts:771:29)

      774 |       } catch (error) {
      775 |         // Explain might not be supported in all environments
    > 776 |         console.warn('Query explanation not supported:', error);
          |                 ^
      777 |       }
      778 |     });
      779 |   });

      at Object.<anonymous> (tests/unit/search-commands.test.ts:776:17)

PASS tests/unit/search-commands.test.ts
  Search Commands - Valkey Search Compatibility
    Index Management
      ✓ should create a full-text search index (108 ms)
      ✓ should handle JSON-based search index (112 ms)
      ✓ should drop indexes correctly (104 ms)
    Document Operations
      ✓ should add documents to index (102 ms)
      ✓ should get documents from index (103 ms)
      ✓ should delete documents from index (104 ms)
      ✓ should handle bulk document operations (105 ms)
    Search Operations
      ✓ should perform basic text search (104 ms)
      ✓ should search with filters (102 ms)
      ✓ should handle category-based search (102 ms)
      ✓ should support fuzzy search (103 ms)
      ✓ should handle complex boolean queries (102 ms)
    Aggregation Operations
      ✓ should perform aggregation queries (112 ms)
      ✓ should handle complex aggregations with multiple operations (107 ms)
    Vector Similarity Search
      ✓ should handle vector search if supported (109 ms)
    Real-World Use Cases
      ✓ should handle e-commerce search scenario (102 ms)
      ✓ should handle content management search (104 ms)
    Error Handling and Edge Cases
      ✓ should handle search on non-existent index (102 ms)
      ✓ should handle malformed queries gracefully (102 ms)
      ✓ should handle empty search results (103 ms)
      ✓ should handle query explanation (178 ms)

FAIL tests/unit/redis-adapter-edge-cases.test.ts
  ● Test suite failed to run

    tests/unit/redis-adapter-edge-cases.test.ts:635:13 - error TS6133: 'hllKey' is declared but its value is never read.

    635       const hllKey = 'test:hll:unique:visitors';
                    ~~~~~~

FAIL tests/unit/pubsub-patterns.test.ts
  ● Test suite failed to run

    tests/unit/pubsub-patterns.test.ts:108:34 - error TS6133: 'pattern' is declared but its value is never read.

    108       subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
                                         ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:153:34 - error TS6133: 'pattern' is declared but its value is never read.

    153       subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
                                         ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:250:36 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    250       const joinEvent = JSON.parse(voiceUpdates[0]);
                                           ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:254:36 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    254       const muteEvent = JSON.parse(voiceUpdates[1]);
                                           ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:258:37 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    258       const leaveEvent = JSON.parse(voiceUpdates[2]);
                                            ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:303:39 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    303       const firstMessage = JSON.parse(chatMessages[0]);
                                              ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:308:37 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    308       const modMessage = JSON.parse(chatMessages[2]);
                                            ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:356:36 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    356       const liveEvent = JSON.parse(streamEvents[0]);
                                           ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:360:40 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    360       const followerEvent = JSON.parse(streamEvents[1]);
                                               ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:364:36 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    364       const raidEvent = JSON.parse(streamEvents[2]);
                                           ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:377:34 - error TS6133: 'pattern' is declared but its value is never read.

    377       subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
                                         ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:454:34 - error TS6133: 'pattern' is declared but its value is never read.

    454       subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
                                         ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:515:33 - error TS6133: 'channel' is declared but its value is never read.

    515       subscriber.on('message', (channel: string, message: string) => {
                                        ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:546:37 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    546       const priceAlert = JSON.parse(alerts[0]);
                                            ~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:551:38 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    551       const volumeAlert = JSON.parse(alerts[1]);
                                             ~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:564:33 - error TS6133: 'channel' is declared but its value is never read.

    564       subscriber.on('message', (channel: string, message: string) => {
                                        ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:608:14 - error TS2532: Object is possibly 'undefined'.

    608       expect(patternMessages[0].message).toBe('matching message');
                     ~~~~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:651:33 - error TS6133: 'channel' is declared but its value is never read.

    651       subscriber.on('message', (channel: string, message: string) => {
                                        ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:672:35 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    672       const received = JSON.parse(largeMessages[0]);
                                          ~~~~~~~~~~~~~~~~

  console.log
    ✅ Valkey-bundle is ready with supported modules: { json: true, search: true }

      at waitForValkeyBundle (tests/utils/valkey-bundle-config.ts:142:17)

PASS tests/unit/json-commands.test.ts
  JSON Commands - ValkeyJSON Compatibility
    Basic JSON Document Operations
      ✓ should set and get simple JSON documents (9 ms)
      ✓ should handle nested JSON documents (5 ms)
      ✓ should handle JSON SET with conditions (NX/XX) (5 ms)
    JSON Path Operations
      ✓ should get type information for paths (5 ms)
      ✓ should delete specific paths (4 ms)
      ✓ should clear paths to empty/null values (6 ms)
    Numeric Operations
      ✓ should increment numeric values (5 ms)
      ✓ should multiply numeric values (3 ms)
    String Operations
      ✓ should append to string values (4 ms)
      ✓ should get string length (4 ms)
    Array Operations
      ✓ should append to arrays (4 ms)
      ✓ should insert into arrays (5 ms)
      ✓ should get array length (4 ms)
      ✓ should pop elements from arrays (5 ms)
      ✓ should trim arrays (4 ms)
    Object Operations
      ✓ should get object keys (3 ms)
      ✓ should get object length (4 ms)
    Boolean Operations
      ✓ should toggle boolean values (6 ms)
    Real-World Use Cases
      ✓ should handle e-commerce product catalog (6 ms)
      ✓ should handle user session data (4 ms)
      ✓ should handle application configuration (5 ms)
    Advanced JSONPath Queries
      ✓ should handle complex path queries (4 ms)
    Error Handling and Edge Cases
      ✓ should handle operations on non-existent keys (5 ms)
      ✓ should handle invalid paths gracefully (3 ms)
      ✓ should handle type mismatches (3 ms)
      ✓ should handle large JSON documents (7 ms)
    Debug and Utility Operations
      ✓ should provide debug information (4 ms)
      ✓ should convert to RESP format (3 ms)
      ✓ should support legacy FORGET command (3 ms)

2025-08-30T09:59:12.496043Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: Unknown command called from script script: 55fc4b3ee64e0cf67884568a7bdc0a26e33df339, on @user_script:3.
  console.warn
    Script object failed, falling back to direct EVAL: RequestError: An error was signalled by the server: - ResponseError: Unknown command called from script script: 55fc4b3ee64e0cf67884568a7bdc0a26e33df339, on @user_script:3.
        at GlideClient.processResponse (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:356:20)
        at GlideClient.handleReadData (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
        at Socket.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
        at Socket.emit (node:events:524:28)
        at addChunk (node:internal/streams/readable:561:12)
        at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
        at Socket.Readable.push (node:internal/streams/readable:392:5)
        at Pipe.onStreamRead (node:internal/stream_base_commons:191:23)

      2119 |     } catch (error) {
      2120 |       // Fallback to direct EVAL command for BullMQ compatibility
    > 2121 |       console.warn('Script object failed, falling back to direct EVAL:', error);
           |               ^
      2122 |       const commandArgs = [script, numkeys.toString(), ...keys, ...args.map(String)];
      2123 |       return await client.customCommand(['EVAL', ...commandArgs]);
      2124 |     }

      at RedisAdapter.eval (src/adapters/RedisAdapter.ts:2121:15)
      at Object.<anonymous> (tests/unit/script-commands.test.ts:613:9)

2025-08-30T09:59:12.522032Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: Unknown command called from script script: 55fc4b3ee64e0cf67884568a7bdc0a26e33df339, on @user_script:3.
PASS tests/unit/script-commands.test.ts
  Script Commands - Atomic Operations & Business Logic
    Rate Limiting Patterns
      ✓ should implement sliding window rate limiter with Lua script (17 ms)
      ✓ should implement token bucket rate limiter like Stripe API (6 ms)
      ✓ should implement fixed window rate limiter like Discord (7 ms)
    Atomic Business Operations
      ✓ should implement atomic inventory management like Shopify (11 ms)
    Distributed Locking Patterns
      ✓ should implement distributed lock with expiration like GitHub (8 ms)
    Counter and Analytics Patterns
      ✓ should implement atomic multi-counter updates for analytics (7 ms)
    Script Caching and Performance
      ✓ should use EVALSHA for script caching optimization (5 ms)
      ✓ should handle complex return types from Lua scripts (6 ms)
    Error Handling and Edge Cases
      ✓ should handle scripts with no keys or arguments (4 ms)
      ✓ should handle scripts with many keys and arguments (5 ms)
      ✓ should handle empty script execution (5 ms)
      ✓ should handle script errors gracefully (32 ms)

2025-08-30T09:59:12.966250Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
2025-08-30T09:59:12.969200Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
PASS tests/unit/set-commands.test.ts
  Set Commands - Social Network & Analytics Patterns
    Twitter-Style Follower/Following System
      ✓ should manage follower relationships with SADD/SREM (17 ms)
      ✓ should find mutual followers using SINTER (8 ms)
      ✓ should suggest friends using SDIFF for "people you may know" (6 ms)
      ✓ should aggregate social reach using SUNION (9 ms)
    Instagram-Style Content Tagging System
      ✓ should manage post tags and find trending topics (8 ms)
      ✓ should implement hashtag recommendation system (7 ms)
    Discord-Style Permission & Role System
      ✓ should manage user roles and permissions (7 ms)
      ✓ should implement channel access control (6 ms)
    LinkedIn-Style Professional Network
      ✓ should manage professional connections and recommendations (7 ms)
      ✓ should implement company employee network (7 ms)
    Real-Time Analytics & A/B Testing
      ✓ should track unique visitors and sessions (11 ms)
      ✓ should implement A/B testing cohorts (9 ms)
      ✓ should track feature usage patterns (8 ms)
    E-commerce & Content Filtering
      ✓ should implement product recommendation engine (8 ms)
      ✓ should implement content moderation system (7 ms)
    Error Handling and Edge Cases
      ✓ should handle operations on non-existent sets (7 ms)
      ✓ should handle type conflicts gracefully (9 ms)
      ✓ should handle large sets efficiently (10 ms)
      ✓ should handle set operations with mixed data types (7 ms)

2025-08-30T09:59:13.675112Z  WARN logger_core: received error - timed out
PASS tests/unit/distributed-locking.test.ts
  Distributed Locking Patterns
    Basic Lock Operations
      ✓ should acquire and release simple lock (17 ms)
      ✓ should prevent duplicate lock acquisition (7 ms)
      ✓ should handle lock expiration (1107 ms)
    Critical Section Protection
      ✓ should protect shared counter increment (20 ms)
      ✓ should coordinate resource access between multiple clients (10 ms)
    Job Processing with Locks
      ✓ should ensure single job processor (58 ms)
      ✓ should handle job queue with exclusive processing (50 ms)
    Advanced Locking Patterns
      ✓ should implement reentrant lock (11 ms)
      ✓ should implement fair queuing with locks (8 ms)
      ✓ should implement distributed semaphore (10 ms)
    Error Handling and Edge Cases
      ✓ should handle lock timeout and recovery (1108 ms)
      ✓ should handle failed lock release gracefully (7 ms)
      ✓ should handle concurrent lock acquisition attempts (7 ms)

FAIL tests/unit/parameter-translation.test.ts
  ● Test suite failed to run

    tests/unit/parameter-translation.test.ts:18:47 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    18       const emptyResult = ParameterTranslator.translateStringParameters('');
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:22:52 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    22       const whitespaceResult = ParameterTranslator.translateStringParameters('   ');
                                                          ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:26:51 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    26       const multilineResult = ParameterTranslator.translateStringParameters('line1\\nline2\\nline3');
                                                         ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:32:47 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    32       const emojiResult = ParameterTranslator.translateStringParameters('Hello 👋 World 🌍');
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:36:49 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    36       const chineseResult = ParameterTranslator.translateStringParameters('你好世界');
                                                       ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:40:48 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    40       const arabicResult = ParameterTranslator.translateStringParameters('مرحبا بالعالم');
                                                      ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:44:54 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    44       const specialCharsResult = ParameterTranslator.translateStringParameters('key:with"quotes\'and\\backslashes');
                                                            ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:51:42 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    51       const result = ParameterTranslator.translateStringParameters(longString);
                                                ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:58:40 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    58       expect(() => ParameterTranslator.translateStringParameters(null as any)).not.toThrow();
                                              ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:59:40 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    59       expect(() => ParameterTranslator.translateStringParameters(undefined as any)).not.toThrow();
                                              ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:66:45 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    66       const intResult = ParameterTranslator.translateNumericParameters(42);
                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:70:47 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    70       const floatResult = ParameterTranslator.translateNumericParameters(3.14159);
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:74:50 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    74       const negativeResult = ParameterTranslator.translateNumericParameters(-100);
                                                        ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:78:46 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    78       const zeroResult = ParameterTranslator.translateNumericParameters(0);
                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:84:47 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    84       const largeResult = ParameterTranslator.translateNumericParameters(Number.MAX_SAFE_INTEGER);
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:88:47 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    88       const smallResult = ParameterTranslator.translateNumericParameters(Number.MIN_SAFE_INTEGER);
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:92:52 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    92       const scientificResult = ParameterTranslator.translateNumericParameters(1e10);
                                                          ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:98:45 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    98       const infResult = ParameterTranslator.translateNumericParameters(Infinity);
                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:101:48 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    101       const negInfResult = ParameterTranslator.translateNumericParameters(-Infinity);
                                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:105:45 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    105       const nanResult = ParameterTranslator.translateNumericParameters(NaN);
                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:111:54 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    111       const stringNumberResult = ParameterTranslator.translateNumericParameters('123' as any);
                                                             ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:116:55 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    116       const decimalStringResult = ParameterTranslator.translateNumericParameters('45.67' as any);
                                                              ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:125:42 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    125       const result = ParameterTranslator.translateArrayParameters(mixedArray);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:137:42 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    137       const result = ParameterTranslator.translateArrayParameters(nestedArray);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:144:47 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    144       const emptyResult = ParameterTranslator.translateArrayParameters([]);
                                                      ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:152:42 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    152       const result = ParameterTranslator.translateArrayParameters(sparseArray);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:163:42 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    163       const result = ParameterTranslator.translateArrayParameters(largeArray);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:189:42 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    189       const result = ParameterTranslator.translateObjectParameters(complexObject);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:205:42 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    205       const result = ParameterTranslator.translateObjectParameters(specialKeyObject);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:218:29 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    218         ParameterTranslator.translateObjectParameters(circularObj);
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:230:42 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    230       const result = ParameterTranslator.translateObjectParameters(objWithFunctions);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:240:42 - error TS2339: Property 'translateHashSetParameters' does not exist on type 'typeof ParameterTranslator'.

    240       const result = ParameterTranslator.translateHashSetParameters(hmsetArgs);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:262:42 - error TS2339: Property 'translateHashSetParameters' does not exist on type 'typeof ParameterTranslator'.

    262       const result = ParameterTranslator.translateHashSetParameters([key, fields]);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:268:45 - error TS2339: Property 'translateHashSetParameters' does not exist on type 'typeof ParameterTranslator'.

    268       const emptyHash = ParameterTranslator.translateHashSetParameters(['key:empty']);
                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:278:42 - error TS2551: Property 'translateSetParameters' does not exist on type 'typeof ParameterTranslator'. Did you mean 'translateSetArgs'?

    278       const result = ParameterTranslator.translateSetParameters(['following:user:abc', ...followers]);
                                                 ~~~~~~~~~~~~~~~~~~~~~~

      src/utils/ParameterTranslator.ts:15:10
        15   static translateSetArgs(args: any[]): {
                    ~~~~~~~~~~~~~~~~
        'translateSetArgs' is declared here.
    tests/unit/parameter-translation.test.ts:288:42 - error TS2551: Property 'translateSetParameters' does not exist on type 'typeof ParameterTranslator'. Did you mean 'translateSetArgs'?

    288       const result = ParameterTranslator.translateSetParameters(['tags:post:123', ...tags]);
                                                 ~~~~~~~~~~~~~~~~~~~~~~

      src/utils/ParameterTranslator.ts:15:10
        15   static translateSetArgs(args: any[]): {
                    ~~~~~~~~~~~~~~~~
        'translateSetArgs' is declared here.
    tests/unit/parameter-translation.test.ts:308:42 - error TS2339: Property 'translateScoreParameters' does not exist on type 'typeof ParameterTranslator'.

    308       const result = ParameterTranslator.translateScoreParameters(zaddArgs);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:326:42 - error TS2339: Property 'translateScoreParameters' does not exist on type 'typeof ParameterTranslator'.

    326       const result = ParameterTranslator.translateScoreParameters(timelineArgs);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:341:42 - error TS2339: Property 'translateScoreParameters' does not exist on type 'typeof ParameterTranslator'.

    341       const result = ParameterTranslator.translateScoreParameters(preciseArgs);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:351:48 - error TS2339: Property 'translateRangeParameters' does not exist on type 'typeof ParameterTranslator'.

    351       const numericRange = ParameterTranslator.translateRangeParameters([0, -1]);
                                                       ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:356:46 - error TS2339: Property 'translateRangeParameters' does not exist on type 'typeof ParameterTranslator'.

    356       const scoreRange = ParameterTranslator.translateRangeParameters(['0', '+inf']);
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:371:44 - error TS2339: Property 'translateRangeParameters' does not exist on type 'typeof ParameterTranslator'.

    371         const result = ParameterTranslator.translateRangeParameters(range);
                                                   ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:379:47 - error TS2339: Property 'translateRangeParameters' does not exist on type 'typeof ParameterTranslator'.

    379       const limitParams = ParameterTranslator.translateRangeParameters(['LIMIT', 10, 20]);
                                                      ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:390:50 - error TS2339: Property 'translateCommandOptions' does not exist on type 'typeof ParameterTranslator'.

    390       const setWithOptions = ParameterTranslator.translateCommandOptions(['key', 'value', 'EX', 300, 'NX']);
                                                         ~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:399:47 - error TS2339: Property 'translateCommandOptions' does not exist on type 'typeof ParameterTranslator'.

    399       const scanOptions = ParameterTranslator.translateCommandOptions([0, 'MATCH', 'user:*', 'COUNT', 100]);
                                                      ~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:409:47 - error TS2339: Property 'translateCommandOptions' does not exist on type 'typeof ParameterTranslator'.

    409       const sortOptions = ParameterTranslator.translateCommandOptions([
                                                      ~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:423:40 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    423       expect(() => ParameterTranslator.translateStringParameters(null as any)).not.toThrow();
                                               ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:424:40 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    424       expect(() => ParameterTranslator.translateNumericParameters(undefined as any)).not.toThrow();
                                               ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:425:40 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    425       expect(() => ParameterTranslator.translateArrayParameters(null as any)).not.toThrow();
                                               ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:430:40 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    430       expect(() => ParameterTranslator.translateNumericParameters('not-a-number' as any)).not.toThrow();
                                               ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:431:40 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    431       expect(() => ParameterTranslator.translateArrayParameters('not-an-array' as any)).not.toThrow();
                                               ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:438:29 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    438         ParameterTranslator.translateArrayParameters(largeParamSet);
                                    ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:445:42 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    445       const result = ParameterTranslator.translateStringParameters(controlChars);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:453:29 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    453         ParameterTranslator.translateStringParameters(binaryData.toString('binary'));
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:461:29 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    461         ParameterTranslator.translateStringParameters(longKey);
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:469:29 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    469         ParameterTranslator.translateStringParameters(malformedJson);
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:483:42 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    483       const result = ParameterTranslator.translateObjectParameters(largeObject);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:501:29 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    501         ParameterTranslator.translateObjectParameters(deepObject);
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~

FAIL tests/unit/cluster-operations.test.ts
  ● Test suite failed to run

    tests/unit/cluster-operations.test.ts:14:10 - error TS2724: '"../../src/types"' has no exported member named 'RedisClusterOptions'. Did you mean 'ClusterOptions'?

    14 import { RedisClusterOptions } from '../../src/types';
                ~~~~~~~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:26:15 - error TS2511: Cannot create an instance of an abstract class.

    26     cluster = new BaseClusterAdapter(config);
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:49:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    49       await cluster.zadd(timelineKey1, now - 3600, 'tweet:1001');
                           ~~~~
    tests/unit/cluster-operations.test.ts:50:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    50       await cluster.zadd(timelineKey1, now - 1800, 'tweet:1002');
                           ~~~~
    tests/unit/cluster-operations.test.ts:51:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    51       await cluster.zadd(timelineKey1, now, 'tweet:1003');
                           ~~~~
    tests/unit/cluster-operations.test.ts:53:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    53       await cluster.zadd(timelineKey2, now - 2400, 'tweet:2001');
                           ~~~~
    tests/unit/cluster-operations.test.ts:54:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    54       await cluster.zadd(timelineKey2, now - 600, 'tweet:2002');
                           ~~~~
    tests/unit/cluster-operations.test.ts:56:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    56       await cluster.zadd(timelineKey3, now - 900, 'tweet:3001');
                           ~~~~
    tests/unit/cluster-operations.test.ts:59:39 - error TS2339: Property 'zrevrange' does not exist on type 'BaseClusterAdapter'.

    59       const timeline1 = await cluster.zrevrange(timelineKey1, 0, -1);
                                             ~~~~~~~~~
    tests/unit/cluster-operations.test.ts:62:39 - error TS2339: Property 'zrevrange' does not exist on type 'BaseClusterAdapter'.

    62       const timeline2 = await cluster.zrevrange(timelineKey2, 0, -1);
                                             ~~~~~~~~~
    tests/unit/cluster-operations.test.ts:65:44 - error TS2339: Property 'zcard' does not exist on type 'BaseClusterAdapter'.

    65       const timeline3Count = await cluster.zcard(timelineKey3);
                                                  ~~~~~
    tests/unit/cluster-operations.test.ts:76:23 - error TS2339: Property 'incrby' does not exist on type 'BaseClusterAdapter'.

    76         await cluster.incrby(key, Math.floor(Math.random() * 1000) + 100);
                             ~~~~~~
    tests/unit/cluster-operations.test.ts:81:37 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    81         const count = await cluster.get(`trending:${hashtag}`);
                                           ~~~
    tests/unit/cluster-operations.test.ts:94:23 - error TS2339: Property 'hmset' does not exist on type 'BaseClusterAdapter'.

    94         await cluster.hmset(photoId, {
                             ~~~~~
    tests/unit/cluster-operations.test.ts:108:40 - error TS2339: Property 'hgetall' does not exist on type 'BaseClusterAdapter'.

    108         const metadata = await cluster.hgetall(photoId);
                                               ~~~~~~~
    tests/unit/cluster-operations.test.ts:116:41 - error TS2339: Property 'hget' does not exist on type 'BaseClusterAdapter'.

    116       const photo1Likes = await cluster.hget(photoIds[0], 'likes');
                                                ~~~~
    tests/unit/cluster-operations.test.ts:117:40 - error TS2339: Property 'hget' does not exist on type 'BaseClusterAdapter'.

    117       const photo2User = await cluster.hget(photoIds[1], 'user_id');
                                               ~~~~
    tests/unit/cluster-operations.test.ts:136:23 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    136         await cluster.zadd(userPhotosKey, photo.timestamp, photo.id);
                              ~~~~
    tests/unit/cluster-operations.test.ts:140:42 - error TS2339: Property 'zrevrange' does not exist on type 'BaseClusterAdapter'.

    140       const recentPhotos = await cluster.zrevrange(userPhotosKey, 0, 1);
                                                 ~~~~~~~~~
    tests/unit/cluster-operations.test.ts:145:39 - error TS2339: Property 'zrangebyscore' does not exist on type 'BaseClusterAdapter'.

    145       const dayPhotos = await cluster.zrangebyscore(userPhotosKey, oneDayAgo, Date.now());
                                              ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:161:25 - error TS2339: Property 'lpush' does not exist on type 'BaseClusterAdapter'.

    161           await cluster.lpush(messageKey,
                                ~~~~~
    tests/unit/cluster-operations.test.ts:170:25 - error TS2339: Property 'lpush' does not exist on type 'BaseClusterAdapter'.

    170           await cluster.lpush(messageKey,
                                ~~~~~
    tests/unit/cluster-operations.test.ts:180:25 - error TS2339: Property 'ltrim' does not exist on type 'BaseClusterAdapter'.

    180           await cluster.ltrim(messageKey, 0, 49);
                                ~~~~~
    tests/unit/cluster-operations.test.ts:186:38 - error TS2339: Property 'lrange' does not exist on type 'BaseClusterAdapter'.

    186       const messages = await cluster.lrange(testChannel, 0, 4);
                                             ~~~~~~
    tests/unit/cluster-operations.test.ts:205:23 - error TS2339: Property 'sadd' does not exist on type 'BaseClusterAdapter'.

    205         await cluster.sadd(presenceKey, 'user123', 'user456', 'user789');
                              ~~~~
    tests/unit/cluster-operations.test.ts:208:23 - error TS2339: Property 'expire' does not exist on type 'BaseClusterAdapter'.

    208         await cluster.expire(presenceKey, 3600); // 1 hour
                              ~~~~~~
    tests/unit/cluster-operations.test.ts:212:42 - error TS2339: Property 'smembers' does not exist on type 'BaseClusterAdapter'.

    212       const generalUsers = await cluster.smembers(`voice:${guildId}:General`);
                                                 ~~~~~~~~
    tests/unit/cluster-operations.test.ts:217:40 - error TS2339: Property 'scard' does not exist on type 'BaseClusterAdapter'.

    217       const musicCount = await cluster.scard(`voice:${guildId}:Music`);
                                               ~~~~~
    tests/unit/cluster-operations.test.ts:221:37 - error TS2339: Property 'srem' does not exist on type 'BaseClusterAdapter'.

    221       const removed = await cluster.srem(`voice:${guildId}:Gaming`, 'user456');
                                            ~~~~
    tests/unit/cluster-operations.test.ts:224:44 - error TS2339: Property 'scard' does not exist on type 'BaseClusterAdapter'.

    224       const remainingCount = await cluster.scard(`voice:${guildId}:Gaming`);
                                                   ~~~~~
    tests/unit/cluster-operations.test.ts:239:23 - error TS2339: Property 'hmset' does not exist on type 'BaseClusterAdapter'.

    239         await cluster.hmset(session.id, {
                              ~~~~~
    tests/unit/cluster-operations.test.ts:250:23 - error TS2339: Property 'expire' does not exist on type 'BaseClusterAdapter'.

    250         await cluster.expire(session.id, 86400);
                              ~~~~~~
    tests/unit/cluster-operations.test.ts:255:43 - error TS2339: Property 'hgetall' does not exist on type 'BaseClusterAdapter'.

    255         const sessionData = await cluster.hgetall(session.id);
                                                  ~~~~~~~
    tests/unit/cluster-operations.test.ts:260:35 - error TS2339: Property 'ttl' does not exist on type 'BaseClusterAdapter'.

    260         const ttl = await cluster.ttl(session.id);
                                          ~~~
    tests/unit/cluster-operations.test.ts:266:21 - error TS2339: Property 'hset' does not exist on type 'BaseClusterAdapter'.

    266       await cluster.hset(activeSession.id, 'last_activity', Date.now().toString());
                            ~~~~
    tests/unit/cluster-operations.test.ts:266:26 - error TS18048: 'activeSession' is possibly 'undefined'.

    266       await cluster.hset(activeSession.id, 'last_activity', Date.now().toString());
                                 ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:267:21 - error TS2339: Property 'expire' does not exist on type 'BaseClusterAdapter'.

    267       await cluster.expire(activeSession.id, 86400); // Reset TTL
                            ~~~~~~
    tests/unit/cluster-operations.test.ts:267:28 - error TS18048: 'activeSession' is possibly 'undefined'.

    267       await cluster.expire(activeSession.id, 86400); // Reset TTL
                                   ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:269:45 - error TS2339: Property 'hget' does not exist on type 'BaseClusterAdapter'.

    269       const updatedActivity = await cluster.hget(activeSession.id, 'last_activity');
                                                    ~~~~
    tests/unit/cluster-operations.test.ts:269:50 - error TS18048: 'activeSession' is possibly 'undefined'.

    269       const updatedActivity = await cluster.hget(activeSession.id, 'last_activity');
                                                         ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:286:23 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    286         await cluster.zadd(viewingHistoryKey, show.timestamp, show.title);
                              ~~~~
    tests/unit/cluster-operations.test.ts:290:43 - error TS2339: Property 'zrevrange' does not exist on type 'BaseClusterAdapter'.

    290       const recentHistory = await cluster.zrevrange(viewingHistoryKey, 0, 2);
                                                  ~~~~~~~~~
    tests/unit/cluster-operations.test.ts:299:41 - error TS2339: Property 'zrangebyscore' does not exist on type 'BaseClusterAdapter'.

    299       const recentViews = await cluster.zrangebyscore(viewingHistoryKey, twoHoursAgo, Date.now());
                                                ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:315:23 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    315         await cluster.set(testKeys[i], `value_${i}`);
                              ~~~
    tests/unit/cluster-operations.test.ts:320:37 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    320         const value = await cluster.get(testKeys[i]);
                                            ~~~
    tests/unit/cluster-operations.test.ts:325:36 - error TS2339: Property 'mget' does not exist on type 'BaseClusterAdapter'.

    325       const values = await cluster.mget(testKeys);
                                           ~~~~
    tests/unit/cluster-operations.test.ts:336:43 - error TS2339: Property 'cluster' does not exist on type 'BaseClusterAdapter'.

    336         const clusterInfo = await cluster.cluster('INFO');
                                                  ~~~~~~~
    tests/unit/cluster-operations.test.ts:345:44 - error TS2339: Property 'cluster' does not exist on type 'BaseClusterAdapter'.

    345         const clusterNodes = await cluster.cluster('NODES');
                                                   ~~~~~~~
    tests/unit/cluster-operations.test.ts:360:21 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    360       await cluster.set(key1, 'value1');
                            ~~~
    tests/unit/cluster-operations.test.ts:361:21 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    361       await cluster.set(key2, 'value2');
                            ~~~
    tests/unit/cluster-operations.test.ts:362:21 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    362       await cluster.set(key3, 'value3');
                            ~~~
    tests/unit/cluster-operations.test.ts:365:36 - error TS2339: Property 'mget' does not exist on type 'BaseClusterAdapter'.

    365       const values = await cluster.mget([key1, key2, key3]);
                                           ~~~~
    tests/unit/cluster-operations.test.ts:369:41 - error TS2339: Property 'exists' does not exist on type 'BaseClusterAdapter'.

    369       const existsCount = await cluster.exists(key1, key2, key3);
                                                ~~~~~~
    tests/unit/cluster-operations.test.ts:386:25 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    386           await cluster.zadd(eventKey, timestamp, eventId);
                                ~~~~
    tests/unit/cluster-operations.test.ts:389:25 - error TS2339: Property 'zremrangebyrank' does not exist on type 'BaseClusterAdapter'.

    389           await cluster.zremrangebyrank(eventKey, 0, -1001);
                                ~~~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:395:40 - error TS2339: Property 'zcard' does not exist on type 'BaseClusterAdapter'.

    395       const eventCount = await cluster.zcard(testUserEvents);
                                               ~~~~~
    tests/unit/cluster-operations.test.ts:400:42 - error TS2339: Property 'zrangebyscore' does not exist on type 'BaseClusterAdapter'.

    400       const recentEvents = await cluster.zrangebyscore(testUserEvents, oneHourAgo, Date.now());
                                                 ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:416:23 - error TS2339: Property 'incrby' does not exist on type 'BaseClusterAdapter'.

    416         await cluster.incrby(dailyKey, incrementValue);
                              ~~~~~~
    tests/unit/cluster-operations.test.ts:419:23 - error TS2339: Property 'expire' does not exist on type 'BaseClusterAdapter'.

    419         await cluster.expire(dailyKey, 90 * 24 * 3600);
                              ~~~~~~
    tests/unit/cluster-operations.test.ts:425:37 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    425         const count = await cluster.get(dailyKey);
                                            ~~~
    tests/unit/cluster-operations.test.ts:431:39 - error TS2339: Property 'mget' does not exist on type 'BaseClusterAdapter'.

    431       const allCounts = await cluster.mget(metricKeys);
                                              ~~~~
    tests/unit/cluster-operations.test.ts:442:36 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    442       const result = await cluster.get('nonexistent:key');
                                           ~~~
    tests/unit/cluster-operations.test.ts:445:40 - error TS2339: Property 'hgetall' does not exist on type 'BaseClusterAdapter'.

    445       const hashResult = await cluster.hgetall('nonexistent:hash');
                                               ~~~~~~~
    tests/unit/cluster-operations.test.ts:448:40 - error TS2339: Property 'llen' does not exist on type 'BaseClusterAdapter'.

    448       const listLength = await cluster.llen('nonexistent:list');
                                               ~~~~
    tests/unit/cluster-operations.test.ts:456:21 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    456       await cluster.set(key, 'string_value');
                            ~~~
    tests/unit/cluster-operations.test.ts:459:28 - error TS2339: Property 'lpush' does not exist on type 'BaseClusterAdapter'.

    459       await expect(cluster.lpush(key, 'item')).rejects.toThrow();
                                   ~~~~~
    tests/unit/cluster-operations.test.ts:460:28 - error TS2339: Property 'sadd' does not exist on type 'BaseClusterAdapter'.

    460       await expect(cluster.sadd(key, 'member')).rejects.toThrow();
                                   ~~~~
    tests/unit/cluster-operations.test.ts:461:28 - error TS2339: Property 'hset' does not exist on type 'BaseClusterAdapter'.

    461       await expect(cluster.hset(key, 'field', 'value')).rejects.toThrow();
                                   ~~~~
    tests/unit/cluster-operations.test.ts:469:21 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    469       await cluster.set(largeKey, largeValue);
                            ~~~
    tests/unit/cluster-operations.test.ts:470:39 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    470       const retrieved = await cluster.get(largeKey);
                                              ~~~
    tests/unit/cluster-operations.test.ts:481:31 - error TS2339: Property 'incr' does not exist on type 'BaseClusterAdapter'.

    481         promises.push(cluster.incr(concurrentKey));
                                      ~~~~
    tests/unit/cluster-operations.test.ts:494:40 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    494       const finalValue = await cluster.get(concurrentKey);
                                               ~~~

PASS tests/integration/caching-analytics/ecommerce-caching.test.ts
  Caching, Analytics & E-commerce Integration
    Application Caching Patterns
      ✓ should implement basic cache-aside pattern (16 ms)
      ✓ should handle cache invalidation patterns (14 ms)
      ✓ should implement write-through cache pattern (12 ms)
      ✓ should handle cache stampede prevention (120 ms)
    Analytics Data Aggregation
      ✓ should track page views with counters (104 ms)
      ✓ should implement real-time event aggregation (16 ms)
      ✓ should handle user activity tracking (15 ms)
    E-commerce Shopping Cart
      ✓ should implement shopping cart with hash operations (15 ms)
      ✓ should handle cart modifications (12 ms)
      ✓ should implement cart abandonment tracking (13 ms)
    Live Notifications & Real-time Features
      ✓ should implement notification queues (14 ms)
      ✓ should track online users (18 ms)
    Performance & Memory Optimization
      ✓ should handle large data sets efficiently (89 ms)

2025-08-30T09:59:17.688429Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: invalid cursor
PASS tests/unit/scan-operations.test.ts
  Scan Operations - Production Iteration Patterns
    Database SCAN Operations
      ✓ should implement safe key iteration with SCAN cursor (12 ms)
      ✓ should handle large dataset scanning like Netflix recommendations (107 ms)
      ✓ should implement key expiration scanning for cleanup (19 ms)
    Hash SCAN Operations
      ✓ should scan user profile fields like LinkedIn profiles (5 ms)
      ✓ should scan product inventory like Shopify store (8 ms)
      ✓ should handle configuration scanning for system monitoring (5 ms)
    Set SCAN Operations
      ✓ should scan social media followers like Twitter (5 ms)
      ✓ should scan active user sessions for monitoring (5 ms)
      ✓ should scan tags and categories for content management (6 ms)
    Sorted Set SCAN Operations
      ✓ should scan leaderboard ranges like gaming platforms (56 ms)
      ✓ should scan time-based rankings like trending topics (10 ms)
      ✓ should scan user activity scores for analytics (29 ms)
    Error Handling and Edge Cases
      ✓ should handle SCAN on non-existent keys gracefully (6 ms)
      ✓ should handle HSCAN on non-existent hash (6 ms)
      ✓ should handle SSCAN on non-existent set (5 ms)
      ✓ should handle ZSCAN on non-existent sorted set (4 ms)
      ✓ should handle invalid cursor values gracefully (5 ms)
      ✓ should handle SCAN with very large COUNT parameter (8 ms)

PASS tests/unit/key-management.test.ts
  Key Management - TTL & Persistence Patterns
    Session Management Patterns
      ✓ should handle user session TTL like Spotify (18 ms)
      ✓ should implement rolling session expiration (105 ms)
      ✓ should handle session cleanup on logout (6 ms)
    Cache TTL Strategies
      ✓ should implement cache warming with TTL like Uber (8 ms)
      ✓ should implement staggered cache expiration (12 ms)
      ✓ should handle cache refresh patterns (6 ms)
    Temporary Data Management
      ✓ should handle rate limiting windows like Amazon (5 ms)
      ✓ should implement OTP expiration like Netflix (8 ms)
      ✓ should handle temporary upload tokens (6 ms)
    Key Persistence Patterns
      ✓ should handle persistent data without TTL (6 ms)
      ✓ should convert expiring key to persistent (6 ms)
      ✓ should handle key backup and restore patterns (9 ms)
    Key Type and Metadata Operations
      ✓ should identify key types for cleanup strategies (13 ms)
      ✓ should handle bulk key operations (8 ms)
      ✓ should handle key pattern matching for maintenance (9 ms)
    Expiration Event Simulation
      ✓ should handle near-expiration scenarios (2507 ms)
      ✓ should handle TTL updates and cancellations (7 ms)
    Error Handling and Edge Cases
      ✓ should handle TTL operations on non-existent keys (4 ms)
      ✓ should handle invalid TTL values gracefully (6 ms)
      ✓ should handle type operations on various data structures (5 ms)
      ✓ should handle concurrent TTL operations (4 ms)

PASS tests/unit/nestjs-cache-patterns.test.ts
  NestJS Cache Integration Patterns
    Cache Manager Pattern
      ✓ should implement basic cache GET/SET with TTL (16 ms)
      ✓ should handle cache miss gracefully (6 ms)
      ✓ should implement cache namespace patterns (8 ms)
    Cache Decorator Simulation Pattern
      ✓ should simulate @Cacheable decorator behavior (8 ms)
      ✓ should simulate @CacheEvict decorator behavior (8 ms)
    Advanced Caching Patterns
      ✓ should implement write-through caching pattern (5 ms)
      ✓ should implement cache-aside pattern (6 ms)
      ✓ should handle cache stampede with SET NX (7 ms)
    Cache Invalidation Patterns
      ✓ should implement tag-based cache invalidation (15 ms)
      ✓ should implement time-based cache refresh (7 ms)
    Performance and Monitoring Patterns
      ✓ should track cache hit/miss statistics (8 ms)
      ✓ should implement cache warming strategy (10 ms)
    Error Handling and Resilience
      ✓ should handle cache failures gracefully (6 ms)
      ✓ should handle expired cache keys properly (1109 ms)

2025-08-30T09:59:29.069276Z  WARN logger_core: connection creation - Failed connecting to localhost:9999, due to Connection refused (os error 111)
2025-08-30T09:59:29.069310Z ERROR logger_core: client creation - Connection error: Standalone(Received error for address `localhost:9999`: Connection refused (os error 111)
)
2025-08-30T09:59:29.069313Z ERROR logger_core: client creation - Connection error: Standalone(Received error for address `localhost:9999`: Connection refused (os error 111)
)
2025-08-30T09:59:29.079595Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: value is not an integer or out of range
PASS tests/unit/connection-pipeline.test.ts (6.942 s)
  Connection Management (ioredis compatibility)
    Client creation patterns
      ✓ should create client with default options (10 ms)
      ✓ should create client with port and host (10 ms)
      ✓ should create client with options object (8 ms)
      ✓ should create client with redis:// URL (8 ms)
      ✓ should handle database selection (11 ms)
    Connection lifecycle
      ✓ should emit ready event when connected (7 ms)
      ✓ should emit connect event (7 ms)
      ✓ should emit end event when disconnected (8 ms)
      ✓ should handle reconnection (11 ms)
    Error handling
      ✓ should emit error events (6363 ms)
      ✓ should handle command errors gracefully (13 ms)
  Pipeline Operations (ioredis compatibility)
    Basic pipeline operations
      ✓ should execute multiple commands in pipeline (12 ms)
      ✓ should handle mixed command types in pipeline (9 ms)
      ✓ should handle errors in pipeline (9 ms)
      ✓ pipeline should be chainable (11 ms)
    Pipeline performance characteristics
      ✓ should batch commands efficiently (10 ms)
      ✓ should handle empty pipeline (8 ms)
    Pipeline with transactions
      ✓ should support atomic transactions (12 ms)
      ✓ should handle transaction rollback on error (10 ms)
      ✓ should support WATCH for optimistic locking (15 ms)
    Pipeline error recovery
      ✓ should continue processing after command error (10 ms)
      ✓ should handle pipeline abort (9 ms)
    Edge cases
      ✓ should handle very large pipelines (23 ms)
      ✓ should handle commands with large payloads (10 ms)

PASS tests/unit/graphql-subscriptions.test.ts
  GraphQL Subscriptions Patterns
    Basic Pub/Sub Operations
      ✓ should publish and handle subscription messages (14 ms)
      ✓ should handle multiple message types on same channel (5 ms)
    Real-time GraphQL Subscription Patterns
      ✓ should simulate subscription to post comments (4 ms)
      ✓ should simulate user activity subscriptions (5 ms)
      ✓ should handle chat room subscriptions (7 ms)
    Pattern-based Subscriptions
      ✓ should handle wildcard pattern subscriptions (5 ms)
      ✓ should simulate global event broadcasting (5 ms)
    Subscription Management Patterns
      ✓ should manage subscription metadata (6 ms)
      ✓ should handle subscription cleanup (10 ms)
      ✓ should track active subscriptions per user (10 ms)
    Performance and Batching Patterns
      ✓ should handle batch message publishing (6 ms)
      ✓ should implement message deduplication (5 ms)
      ✓ should implement rate limiting for subscriptions (12 ms)
    Error Handling and Resilience
      ✓ should handle malformed subscription messages (5 ms)
      ✓ should handle subscription timeout and cleanup (7 ms)
      ✓ should handle connection recovery scenarios (7 ms)

PASS tests/unit/result-translator.test.ts
  ResultTranslator
    flattenSortedSetData
      ✓ should flatten valid SortedSetDataType to ioredis format (2 ms)
      ✓ should handle empty SortedSetDataType array (1 ms)
      ✓ should handle non-array input
      ✓ should handle SortedSetDataType with Buffer elements
      ✓ should handle SortedSetDataType with negative scores (1 ms)
      ✓ should handle very large and small scores (1 ms)
    formatStreamEntries
      ✓ should handle empty stream entries array (1 ms)
      ✓ should handle non-array input (1 ms)
      ✓ should pass through stream entries as placeholder (1 ms)
      ✓ should handle mixed stream entry types (1 ms)
    formatBlockingPopResult
      ✓ should format valid blocking pop result
      ✓ should handle null input (1 ms)
      ✓ should handle undefined input
      ✓ should handle non-array input
      ✓ should handle array with wrong length (1 ms)
      ✓ should handle Buffer GlideString inputs (1 ms)
      ✓ should handle zero and negative scores (1 ms)
    convertStringArray
      ✓ should convert valid GlideString array
      ✓ should handle empty array (1 ms)
      ✓ should handle non-array input
      ✓ should handle Buffer GlideString elements
      ✓ should handle null elements gracefully (1 ms)
      ✓ should handle mixed string and Buffer array (3 ms)
    formatRangeResult
      ✓ should format SortedSetDataType when withScores is true (1 ms)
      ✓ should format string array when withScores is false (1 ms)
      ✓ should handle non-array input (1 ms)
      ✓ should handle empty arrays
      ✓ should handle Buffer elements when withScores is false (1 ms)
      ✓ should handle SortedSetDataType with Buffer elements when withScores is true (1 ms)
    formatFloatResult
      ✓ should format integer values (1 ms)
      ✓ should format decimal values
      ✓ should handle floating point precision issues (1 ms)
      ✓ should handle very small numbers (1 ms)
      ✓ should handle very large numbers (1 ms)
      ✓ should handle special float values (1 ms)
      ✓ should handle rounding edge cases (1 ms)
    translateError
      ✓ should pass through Error instances unchanged (1 ms)
      ✓ should convert error-like objects to Error instances (1 ms)
      ✓ should handle null error input
      ✓ should handle undefined error input (1 ms)
      ✓ should handle string error input (1 ms)
      ✓ should handle object without message property
      ✓ should preserve Error subclass types (1 ms)
      ✓ should handle TypeError and other Error types (1 ms)

2025-08-30T09:59:30.314482Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
2025-08-30T09:59:30.317984Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
2025-08-30T09:59:30.319038Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
2025-08-30T09:59:30.320060Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
2025-08-30T09:59:30.325538Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: index out of range
2025-08-30T09:59:30.326411Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: index out of range
2025-08-30T09:59:30.327914Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: value is not an integer or out of range
2025-08-30T09:59:31.538302Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: value is not an integer or out of range
2025-08-30T09:59:31.545108Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: index out of range
PASS tests/unit/error-handling.test.ts
  Error Handling and Edge Cases
    Connection Error Handling
      ✓ should handle graceful disconnection (14 ms)
      ✓ should handle invalid configuration gracefully (2 ms)
    Command Error Scenarios
      ✓ should handle type conflicts gracefully (16 ms)
      ✓ should handle invalid command arguments (7 ms)
      ✓ should handle memory pressure scenarios (6 ms)
    Transaction Error Handling
      ✓ should handle transaction failures gracefully (8 ms)
      ✓ should handle empty transactions (1 ms)
    Pipeline Error Recovery
      ✓ should handle mixed success/failure in pipelines (6 ms)
      ✓ should handle pipeline abort scenarios (4 ms)
    Data Structure Edge Cases
      ✓ should handle empty data structures (13 ms)
      ✓ should handle boundary value operations (7 ms)
      ✓ should handle numeric edge cases (7 ms)
    Concurrency and Race Conditions
      ✓ should handle concurrent operations on same key (7 ms)
      ✓ should handle concurrent pipeline executions (9 ms)
    Resource Cleanup and Lifecycle
      ✓ should handle proper cleanup of expired keys (1107 ms)
      ✓ should handle cleanup of complex data structures (10 ms)
    Command Parameter Validation
      ✓ should validate command parameters appropriately (6 ms)
      ✓ should handle malformed key patterns (10 ms)
    Recovery Scenarios
      ✓ should handle graceful degradation (7 ms)
      ✓ should maintain data consistency during errors (7 ms)

2025-08-30T09:59:32.223719Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.223733Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.224425Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7002" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.224437Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7002" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.224796Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.224808Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.225274Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.225285Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.225826Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.225838Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.226573Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.226583Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.227011Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.227022Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.227453Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.227463Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.228010Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.228021Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.228801Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.228811Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.229219Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.229229Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.229469Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.229479Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.229938Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.229949Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.230388Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.230397Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.230904Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.230914Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.231398Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.231408Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.231871Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.231882Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.234141Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.234151Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.234575Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.234585Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.255443Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "localhost:9999" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.255455Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "localhost:9999" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.257578Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.257587Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.258048Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.258058Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.258699Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "localhost:9999" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.258713Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "localhost:9999" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
FAIL tests/cluster/core/cluster-basic.test.ts
  ClusterAdapter - Basic Tests
    Basic Operations
      ✓ should create cluster adapter with single node (3 ms)
      ✓ should create cluster adapter with multiple nodes (1 ms)
      ✓ should support createClient factory method (1 ms)
      ✓ should support createClient with bclient type (1 ms)
      ✓ should support createClient with subscriber type (1 ms)
    Configuration Options
      ✓ should accept cluster-specific options (2 ms)
      ✓ should use default cluster options (3 ms)
    Duplicate Method
      ✓ should create duplicate cluster adapter (2 ms)
      ✓ should preserve blocking operations in duplicate (2 ms)
    Pipeline and Multi
      ✓ should create pipeline (1 ms)
      ✓ should create multi transaction (1 ms)
    Command Delegation
      ✓ should have string command methods (2 ms)
      ✓ should have hash command methods (1 ms)
      ✓ should have list command methods (2 ms)
      ✓ should have sorted set command methods (1 ms)
      ✓ should have pub/sub command methods (1 ms)
      ✓ should have transaction command methods (2 ms)
      ✓ should have blocking command methods (1 ms)
      ✓ should have stream command methods (2 ms)
    Event Handling
      ✓ should forward pub/sub events (14 ms)
    Connection Management
      ✓ should have connection methods (2 ms)
      ✓ should have sendCommand method (1 ms)
    Bull Compatibility
      ✓ should work with Bull createClient pattern (1 ms)
    Error Handling
      ✕ should handle connection errors gracefully (41 ms)
  ClusterAdapter - Cluster Specific Features
    Read Scaling
      ✓ should support master read scaling (1 ms)
      ✓ should support slave read scaling (1 ms)
      ✓ should support all nodes read scaling (1 ms)
    Replica Configuration
      ✓ should support reading from replicas (2 ms)
      ✓ should support read-only mode (1 ms)
    Cluster Resilience
      ✓ should configure max redirections (1 ms)
      ✓ should configure retry delay on failover
      ✓ should support offline queue configuration

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7002" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7002" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

(node:3743) [JEST-01] DeprecationWarning: 'matchers' property was accessed on [Object] after it was soft deleted
  Jest deletes objects that were set on the global scope between test files to reduce memory leaks.
  Currently it only "soft" deletes them and emits this warning if those objects were accessed after their deletion.
  In future versions of Jest, this behavior will change to "on", which will likely fail tests.
  You can change the behavior in your test configuration now to reduce memory usage.
(Use `node --trace-deprecation ...` to show where the warning was created)
2025-08-30T09:59:32.698166Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.698180Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.698615Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.698625Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.699179Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.699188Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.699771Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.699781Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.700322Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.700332Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.700910Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.700919Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.701455Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.701463Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.702028Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
2025-08-30T09:59:32.702037Z ERROR logger_core: client creation - Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)
FAIL tests/cluster/integrations/bull/bull-cluster.test.ts
  Bull Integration with ClusterAdapter
    Bull createClient Pattern
      ✓ should work with Bull createClient factory (4 ms)
      ✓ should enable blocking operations for bclient (1 ms)
      ✓ should create separate client instances (1 ms)
    Cluster Configuration
      ✓ should accept cluster-specific options in createClient (1 ms)
      ✓ should support single node cluster configuration (1 ms)
    Bull Command Compatibility
      ✓ should have all required Bull commands on client (4 ms)
      ✓ should have blocking commands on bclient (3 ms)
      ✓ should have pub/sub commands on subscriber (6 ms)
    Bull Lua Script Compatibility
      ✓ should support defineCommand for Bull Lua scripts (2 ms)
      ✓ should support BullMQ-style array arguments (2 ms)
      ✓ should handle empty Lua script results (2 ms)
    Connection Management
      ✓ should handle connection lifecycle (1 ms)
      ✓ should support connection options (1 ms)
    Event Handling
      ✓ should emit connection events (12 ms)
      ✕ should forward pub/sub events (11 ms)
    Error Handling
      ✓ should handle cluster connection errors (1 ms)
      ✓ should handle individual node failures (1 ms)
    Performance Considerations
      ✓ should support connection pooling (1 ms)
      ✓ should support read scaling configuration (1 ms)

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

PASS tests/integration/bullmq/basic-queue.test.ts (12.743 s)
  BullMQ Integration - Basic Queue Operations
    Basic Job Processing
      ✓ should add and process a simple job (866 ms)
      ✓ should handle multiple jobs in sequence (1330 ms)
      ✓ should handle job with priority (2336 ms)
    Job State Management
      ✓ should track job states correctly (1382 ms)
      ✓ should handle job removal (777 ms)
    Queue Statistics
      ✓ should provide accurate queue counts (1232 ms)
    Error Handling
      ✓ should handle job failures gracefully (1337 ms)
      ✓ should handle connection recovery scenarios (1331 ms)
      ✓ should provide meaningful error messages for setup failures (327 ms)
      ✓ should handle worker initialization errors gracefully (1335 ms)

2025-08-30T09:59:45.965446Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: DEBUG command not allowed. If the enable-debug-command option is set to "local", you can run it from a local connection, otherwise you need to set this option in the configuration file, and then restart the server.
2025-08-30T09:59:46.015234Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: DEBUG command not allowed. If the enable-debug-command option is set to "local", you can run it from a local connection, otherwise you need to set this option in the configuration file, and then restart the server.
PASS tests/unit/system-commands.test.ts
  System Commands - Monitoring & Metrics
    Server Information Commands
      ✓ should retrieve server info like Netflix monitoring (15 ms)
      ✓ should get specific info sections for targeted monitoring (6 ms)
      ✓ should get server configuration like Airbnb systems (6 ms)
      ✓ should monitor database size like Discord (7 ms)
    Memory Monitoring Commands
      ✓ should track memory usage patterns like Stripe (24 ms)
      ✓ should analyze memory statistics for performance tuning (5 ms)
    Client Monitoring Commands
      ✓ should monitor client connections like GitHub (6 ms)
      ✓ should track command statistics for performance analysis (7 ms)
    Performance Monitoring Commands
      ✓ should measure latency like Netflix systems (5 ms)
      ✓ should monitor slowlog for performance issues (4 ms)
      ✓ should benchmark operations for capacity planning (100 ms)
    Debugging and Diagnostic Commands
      ✓ should provide debug information for troubleshooting (6 ms)
      ✓ should support ping for connectivity testing (9 ms)
      ✓ should handle echo for message verification (7 ms)
      ✓ should provide time information for synchronization (4 ms)
    Security and Access Monitoring
      ✓ should handle auth-related monitoring (4 ms)
    Error Handling and Edge Cases
      ✓ should handle unknown INFO sections gracefully (5 ms)
      ✓ should handle CONFIG commands with invalid parameters (6 ms)
      ✓ should handle MEMORY commands gracefully when not supported (4 ms)
      ✓ should handle CLIENT commands when restricted (4 ms)
      ✓ should handle DEBUG commands when disabled (5 ms)

2025-08-30T09:59:46.405057Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
2025-08-30T09:59:46.408220Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
PASS tests/unit/list-commands.test.ts
  List Commands - Real-World Patterns
    Task Queue Implementation
      ✓ should manage task queue with LPUSH/RPOP (16 ms)
      ✓ should implement priority queue with LPUSH/LPOP (6 ms)
      ✓ should handle bulk task operations with LPUSH/RPUSH (6 ms)
    Message Queue Pattern
      ✓ should implement producer-consumer pattern (6 ms)
      ✓ should handle message inspection with LRANGE (8 ms)
    Activity Log Pattern
      ✓ should maintain user activity logs with LPUSH (6 ms)
      ✓ should implement log rotation with LTRIM (6 ms)
    Job Processing Queue
      ✓ should handle job insertion and retrieval (5 ms)
      ✓ should implement failed job retry queue (7 ms)
    Advanced List Operations
      ✓ should handle list element access by index (6 ms)
      ✓ should modify list elements with LSET (7 ms)
      ✓ should remove elements with LREM (7 ms)
    Error Handling and Edge Cases
      ✓ should handle operations on non-existent lists (8 ms)
      ✓ should handle type conflicts gracefully (9 ms)
      ✓ should handle empty list cleanup (7 ms)
      ✓ should handle large list operations (7 ms)

  console.log
    ✅ Valkey-bundle is ready with supported modules: { json: true, search: true }

      at waitForValkeyBundle (tests/utils/valkey-bundle-config.ts:142:17)

2025-08-30T09:59:46.789931Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
PASS tests/integration/real-world-patterns.test.ts
  Real-World ioredis Usage Patterns
    Basic Connection Patterns
      ✓ should handle basic Redis constructor pattern from GitHub examples (4 ms)
      ✓ should handle authentication patterns from production (2 ms)
    Basic Operations (from ioredis/examples/basic_operations.js)
      ✓ should handle string operations (3 ms)
      ✓ should handle complex operations with multiple arguments (3 ms)
      ✓ should handle flattened arguments (3 ms)
    Hash Operations (from ioredis/examples/hash.js)
      ✓ should handle object-based hash setting (4 ms)
      ✓ should handle individual hash operations (7 ms)
    Bull Queue Patterns
      ✓ should handle Bull queue Redis configuration (2 ms)
      ✓ should handle job data serialization patterns (3 ms)
    Session Store Patterns
      ✓ should handle express-session Redis store pattern (3 ms)
    Caching Patterns
      ✓ should handle application caching patterns (3 ms)
      ✓ should handle cache miss and set patterns (3 ms)
    Counter and Analytics Patterns
      ✓ should handle page view counter pattern (3 ms)
      ✓ should handle user activity tracking with hashes (7 ms)
    List-based Queue Patterns
      ✓ should handle simple task queue pattern (7 ms)
    Rate Limiting Patterns
      ✓ should handle sliding window rate limiting (4 ms)
    Pub/Sub Patterns
      ✓ should handle basic pub/sub pattern (2 ms)
    Error Handling Patterns
      ✓ should handle connection resilience (2 ms)
      ✓ should handle type mismatches gracefully (3 ms)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.warn
    ⚠️  Cross-instance test failed: Cross-instance message not received (Redis adapter may not be working)

      290 |         console.log('✅ Cross-instance communication working!');
      291 |       } catch (error) {
    > 292 |         console.warn(
          |                 ^
      293 |           '⚠️  Cross-instance test failed:',
      294 |           (error as Error).message
      295 |         );

      at Object.<anonymous> (tests/integration/socketio/redis-adapter.test.ts:292:17)

  console.warn
       This may indicate Redis adapter compatibility issues

      294 |           (error as Error).message
      295 |         );
    > 296 |         console.warn('   This may indicate Redis adapter compatibility issues');
          |                 ^
      297 |         // Don't fail the test, just warn - adapter compatibility is complex
      298 |       }
      299 |

      at Object.<anonymous> (tests/integration/socketio/redis-adapter.test.ts:296:17)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:145:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.punsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2020:32)
        at RedisAdapter.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@socket.io/redis-adapter/dist/index.js:690:28)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:488:31
        at Array.map (<anonymous>)
        at Server.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/socket.io/dist/index.js:484:59)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/integration/socketio/redis-adapter.test.ts:148:11)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

FAIL tests/integration/socketio/redis-adapter.test.ts (64.756 s)
  Socket.IO Redis Adapter Integration
    Basic Socket.IO Functionality
      ✕ should connect and communicate with single instance (60209 ms)
      ✓ should handle room joining and broadcasting (405 ms)
    Cross-Instance Communication (requires Redis adapter)
      ✓ should broadcast messages across different Socket.IO instances (2303 ms)
    Room Management
      ✓ should handle multiple rooms correctly (258 ms)
    Error Handling
      ✓ should handle Redis connection errors gracefully (268 ms)
      ✓ should handle disconnections properly (258 ms)
    Performance & Scalability
      ✓ should handle multiple concurrent connections (354 ms)

  ● Socket.IO Redis Adapter Integration › Basic Socket.IO Functionality › should connect and communicate with single instance

    listen EADDRINUSE: address already in use :::60000

      133 |
      134 |     await new Promise<void>((resolve) => {
    > 135 |       server2.listen(port2, resolve);
          |               ^
      136 |     });
      137 |
      138 |     // Wait for servers to be ready

      at tests/integration/socketio/redis-adapter.test.ts:135:15
      at Object.<anonymous> (tests/integration/socketio/redis-adapter.test.ts:134:11)

  ● Socket.IO Redis Adapter Integration › Basic Socket.IO Functionality › should connect and communicate with single instance

    thrown: "Exceeded timeout of 60000 ms for a hook.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      33 |   });
      34 |
    > 35 |   beforeEach(async () => {
         |   ^
      36 |     // Skip tests if servers are not available
      37 |     const serversAvailable = await testUtils.checkTestServers();
      38 |     if (!serversAvailable) {

      at tests/integration/socketio/redis-adapter.test.ts:35:3
      at Object.<anonymous> (tests/integration/socketio/redis-adapter.test.ts:15:1)

2025-08-30T10:00:56.391674Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: value is not an integer or out of range
2025-08-30T10:00:56.405659Z  WARN logger_core: received error - An error was signalled by the server: - ResponseError: value is not an integer or out of range
PASS tests/unit/string-commands.test.ts
  String Commands (ioredis compatibility)
    GET and SET operations
      ✓ set and get should work with basic string values (13 ms)
      ✓ get should return null for non-existent keys (10 ms)
      ✓ set should overwrite existing values (10 ms)
      ✓ set with expiration using EX option (1512 ms)
      ✓ set with expiration using PX option (611 ms)
      ✓ set with NX option (only if not exists) (11 ms)
      ✓ set with XX option (only if exists) (12 ms)
      ✓ set with combined options EX and NX (10 ms)
    MGET and MSET operations
      ✓ mset should set multiple keys at once (12 ms)
      ✓ mset should accept object format (14 ms)
      ✓ mget should return multiple values (13 ms)
      ✓ mget should return null for non-existent keys (15 ms)
    Increment and Decrement operations
      ✓ incr should increment by 1 (9 ms)
      ✓ incr should initialize to 1 for non-existent key (11 ms)
      ✓ incrby should increment by specified amount (10 ms)
      ✓ decr should decrement by 1 (9 ms)
      ✓ decrby should decrement by specified amount (11 ms)
      ✓ incrbyfloat should handle float values (10 ms)
    String manipulation operations
      ✓ append should append to existing string (13 ms)
      ✓ append should set value for non-existent key (10 ms)
      ✓ strlen should return string length (16 ms)
      ✓ strlen should return 0 for non-existent key (10 ms)
      ✓ getrange should return substring (12 ms)
      ✓ setrange should modify part of string (12 ms)
    Advanced SET operations
      ✓ setex should set key with expiration (1510 ms)
      ✓ setnx should set only if key does not exist (11 ms)
      ✓ psetex should set key with millisecond expiration (610 ms)
    Error handling
      ✓ incr should throw error for non-numeric value (15 ms)
      ✓ incrby should throw error for non-numeric value (12 ms)
      ✓ operations should handle large values (11 ms)

2025-08-30T10:00:56.804292Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
2025-08-30T10:00:56.806843Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
PASS tests/unit/hash-commands.test.ts
  Hash Commands - Real-World Patterns
    User Session Management
      ✓ should manage user session data with HSET/HGET (24 ms)
      ✓ should handle bulk session operations with HMGET/HMSET (7 ms)
      ✓ should update session counters with HINCRBY (7 ms)
    User Profile Caching
      ✓ should cache user profiles with HGETALL (7 ms)
      ✓ should handle profile field operations (8 ms)
    Shopping Cart Implementation
      ✓ should manage shopping cart items (7 ms)
      ✓ should handle cart item quantity updates (7 ms)
    Advanced Hash Operations
      ✓ should handle floating point increments (8 ms)
      ✓ should handle conditional field setting with HSETNX (6 ms)
      ✓ should handle bulk field deletion (7 ms)
    Error Handling and Edge Cases
      ✓ should handle operations on non-existent hashes (9 ms)
      ✓ should handle type conflicts gracefully (10 ms)
      ✓ should handle empty field names and values (12 ms)

2025-08-30T10:00:57.226110Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
2025-08-30T10:00:57.234195Z  WARN logger_core: received error - WRONGTYPE: Operation against a key holding the wrong kind of value
PASS tests/unit/zset-commands.test.ts
  ZSet Commands - Real-World Patterns
    Gaming Leaderboard Pattern
      ✓ should handle game score updates with ZADD (24 ms)
      ✓ should increment player scores with ZINCRBY (6 ms)
      ✓ should get top players with ZREVRANGE (7 ms)
      ✓ should find player rank with ZREVRANK and ZSCORE (7 ms)
      ✓ should handle score range queries with ZRANGEBYSCORE (9 ms)
    Time-based Activity Feed Pattern
      ✓ should manage activity timestamps with ZADD (7 ms)
      ✓ should cleanup old activities with ZREMRANGEBYSCORE (6 ms)
    Priority Queue Pattern
      ✓ should implement priority task queue (6 ms)
      ✓ should handle empty queue operations (7 ms)
    Complex Scoring Scenarios
      ✓ should handle score updates correctly (8 ms)
      ✓ should handle large datasets efficiently (8 ms)
    Error Handling and Edge Cases
      ✓ should handle invalid operations gracefully (5 ms)
      ✓ should handle type errors for wrong data types (21 ms)
      ✓ should handle floating point scores correctly (8 ms)

PASS tests/integration/session-store/connect-redis.test.ts
  Express Session Store Integration
    Session Lifecycle
      ✓ should create session on login (46 ms)
      ✓ should maintain session across requests (28 ms)
      ✓ should update session data (42 ms)
      ✓ should destroy session on logout (35 ms)
    Session Security & TTL
      ✓ should handle concurrent sessions (37 ms)
      ✓ should reject requests without valid session (25 ms)
      ✓ should handle invalid session cookies (15 ms)
    Redis Integration
      ✓ should store session data with correct TTL (20 ms)
      ✓ should handle Redis connection errors gracefully (21 ms)
      ✓ should clean up expired sessions (520 ms)

  console.log
    🔧 Creating client Redis client for Bull integration

      at Function.createClient (src/adapters/RedisAdapter.ts:770:13)

  console.log
    🔧 Creating subscriber Redis client for Bull integration

      at Function.createClient (src/adapters/RedisAdapter.ts:770:13)

  console.log
    🔧 Creating bclient Redis client for Bull integration

      at Function.createClient (src/adapters/RedisAdapter.ts:770:13)

  console.log
    🔧 Creating client Redis client for Bull integration

      at Function.createClient (src/adapters/RedisAdapter.ts:770:13)

  console.log
    🔧 Creating bclient Redis client for Bull integration

      at Function.createClient (src/adapters/RedisAdapter.ts:770:13)

PASS tests/unit/enhanced-features.test.ts
  Enhanced Features for Queue Compatibility
    Enhanced defineCommand
      ✓ supports variadic arguments (ioredis style) (10 ms)
      ✓ supports array arguments (BullMQ style) (6 ms)
      ✓ returns empty array instead of null for empty results (8 ms)
      ✓ handles complex argument types (6 ms)
    Static createClient factory
      ✓ creates client type (7 ms)
      ✓ creates subscriber type (7 ms)
      ✓ creates bclient type with blocking ops enabled (10 ms)
      ✓ returns client immediately (Bull compatibility) (7 ms)
    Enhanced ZSET operations
      ✓ zrangebyscore basic functionality (8 ms)
      ✓ zrangebyscore with WITHSCORES (6 ms)
      ✓ zrangebyscore with LIMIT (8 ms)
      ✓ zrevrangebyscore functionality (9 ms)
      ✓ zpopmin functionality (15 ms)
      ✓ zpopmax functionality (6 ms)
    Blocking operations
      ✓ brpoplpush with existing data (7 ms)
      ✓ brpoplpush timeout behavior (1034 ms)
      ✓ blpop with existing data (8 ms)
      ✓ blpop timeout behavior (1008 ms)
      ✓ brpop with existing data (7 ms)
    Enhanced duplicate method
      ✓ preserves client type when duplicating (7 ms)
      ✓ allows override options (9 ms)
      ✓ connects in background (Bull compatibility) (6 ms)

  console.error
    ValidationError: The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting. See https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/ for more information.
        at Object.trustProxy (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:346:13)
        at Object.wrappedValidations.<computed> [as trustProxy] (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:606:22)
        at Object.keyGenerator (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:707:20)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:766:32
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:747:5 {
      code: 'ERR_ERL_PERMISSIVE_TRUST_PROXY',
      help: 'https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/'
    }

      at Object.wrappedValidations.<computed> [as trustProxy] (node_modules/express-rate-limit/dist/index.cjs:612:24)
      at Object.keyGenerator (node_modules/express-rate-limit/dist/index.cjs:707:20)
      at node_modules/express-rate-limit/dist/index.cjs:766:32
      at node_modules/express-rate-limit/dist/index.cjs:747:5

  console.error
    ValidationError: The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting. See https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/ for more information.
        at Object.trustProxy (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:346:13)
        at Object.wrappedValidations.<computed> [as trustProxy] (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:606:22)
        at Object.keyGenerator (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:707:20)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:766:32
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:747:5 {
      code: 'ERR_ERL_PERMISSIVE_TRUST_PROXY',
      help: 'https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/'
    }

      at Object.wrappedValidations.<computed> [as trustProxy] (node_modules/express-rate-limit/dist/index.cjs:612:24)
      at Object.keyGenerator (node_modules/express-rate-limit/dist/index.cjs:707:20)
      at node_modules/express-rate-limit/dist/index.cjs:766:32
      at node_modules/express-rate-limit/dist/index.cjs:747:5

  console.error
    ValidationError: The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting. See https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/ for more information.
        at Object.trustProxy (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:346:13)
        at Object.wrappedValidations.<computed> [as trustProxy] (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:606:22)
        at Object.keyGenerator (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:707:20)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:766:32
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:747:5 {
      code: 'ERR_ERL_PERMISSIVE_TRUST_PROXY',
      help: 'https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/'
    }

      at Object.wrappedValidations.<computed> [as trustProxy] (node_modules/express-rate-limit/dist/index.cjs:612:24)
      at Object.keyGenerator (node_modules/express-rate-limit/dist/index.cjs:707:20)
      at node_modules/express-rate-limit/dist/index.cjs:766:32
      at node_modules/express-rate-limit/dist/index.cjs:747:5

  console.error
    ValidationError: The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting. See https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/ for more information.
        at Object.trustProxy (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:346:13)
        at Object.wrappedValidations.<computed> [as trustProxy] (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:606:22)
        at Object.keyGenerator (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:707:20)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:766:32
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:747:5 {
      code: 'ERR_ERL_PERMISSIVE_TRUST_PROXY',
      help: 'https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/'
    }

      at Object.wrappedValidations.<computed> [as trustProxy] (node_modules/express-rate-limit/dist/index.cjs:612:24)
      at Object.keyGenerator (node_modules/express-rate-limit/dist/index.cjs:707:20)
      at node_modules/express-rate-limit/dist/index.cjs:766:32
      at node_modules/express-rate-limit/dist/index.cjs:747:5

  console.error
    ValidationError: The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting. See https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/ for more information.
        at Object.trustProxy (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:346:13)
        at Object.wrappedValidations.<computed> [as trustProxy] (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:606:22)
        at Object.keyGenerator (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:707:20)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:766:32
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:747:5 {
      code: 'ERR_ERL_PERMISSIVE_TRUST_PROXY',
      help: 'https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/'
    }

      at Object.wrappedValidations.<computed> [as trustProxy] (node_modules/express-rate-limit/dist/index.cjs:612:24)
      at Object.keyGenerator (node_modules/express-rate-limit/dist/index.cjs:707:20)
      at node_modules/express-rate-limit/dist/index.cjs:766:32
      at node_modules/express-rate-limit/dist/index.cjs:747:5

  console.error
    ValidationError: The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting. See https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/ for more information.
        at Object.trustProxy (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:346:13)
        at Object.wrappedValidations.<computed> [as trustProxy] (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:606:22)
        at Object.keyGenerator (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:707:20)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:766:32
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:747:5 {
      code: 'ERR_ERL_PERMISSIVE_TRUST_PROXY',
      help: 'https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/'
    }

      at Object.wrappedValidations.<computed> [as trustProxy] (node_modules/express-rate-limit/dist/index.cjs:612:24)
      at Object.keyGenerator (node_modules/express-rate-limit/dist/index.cjs:707:20)
      at node_modules/express-rate-limit/dist/index.cjs:766:32
      at node_modules/express-rate-limit/dist/index.cjs:747:5

  console.error
    ValidationError: The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting. See https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/ for more information.
        at Object.trustProxy (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:346:13)
        at Object.wrappedValidations.<computed> [as trustProxy] (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:606:22)
        at Object.keyGenerator (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:707:20)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:766:32
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/express-rate-limit/dist/index.cjs:747:5 {
      code: 'ERR_ERL_PERMISSIVE_TRUST_PROXY',
      help: 'https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/'
    }

      at Object.wrappedValidations.<computed> [as trustProxy] (node_modules/express-rate-limit/dist/index.cjs:612:24)
      at Object.keyGenerator (node_modules/express-rate-limit/dist/index.cjs:707:20)
      at node_modules/express-rate-limit/dist/index.cjs:766:32
      at node_modules/express-rate-limit/dist/index.cjs:747:5

PASS tests/integration/rate-limiting/express-rate-limit.test.ts
  Rate Limiting Integration
    Basic Rate Limiting
      ✓ should allow requests within limit (51 ms)
      ✓ should block requests over limit (43 ms)
      ✓ should not affect unlimited endpoints (46 ms)
    Rate Limit Reset
      ✓ should reset rate limit after window expires (1245 ms)
    Multiple IPs
      ✓ should track rate limits per IP independently (56 ms)
    Redis Integration
      ✓ should store rate limit data in Redis (21 ms)
      ✓ should clean up expired keys (1225 ms)

  console.log
    📝 Current limitation: Message reception not implemented

      at Object.<anonymous> (tests/unit/pubsub-basic.test.ts:132:17)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.unsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2003:32)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/unit/pubsub-basic.test.ts:40:26)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at runNextTicks (node:internal/process/task_queues:60:5)
        at listOnTimeout (node:internal/timers:545:9)
        at processTimers (node:internal/timers:519:7)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.log
    📝 Current limitation: Pattern message reception not implemented

      at Object.<anonymous> (tests/unit/pubsub-basic.test.ts:163:17)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.unsubscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:2003:32)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/unit/pubsub-basic.test.ts:40:26)
        at Promise.finally.completed (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1556:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1496:10)
        at _callCircusHook (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:975:40)
        at runNextTicks (node:internal/process/task_queues:60:5)
        at listOnTimeout (node:internal/timers:545:9)
        at processTimers (node:internal/timers:519:7)
        at _runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:948:5)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:829:11)
        at run (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/jestAdapterInit.js:1917:21)
        at jestAdapter (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-circus/build/runner.js:101:19)
        at runTestInternal (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:275:16)
        at runTest (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/jest-runner/build/index.js:343:7)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at LibraryGlideIntegration.reinitialize (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:298:16)
        at LibraryGlideIntegration.updateSubscriptions (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:293:16)
        at RedisAdapter.subscribe (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/adapters/RedisAdapter.ts:1994:33)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/unit/pubsub-basic.test.ts:188:22)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

PASS tests/unit/pubsub-basic.test.ts
  Basic Pub/Sub Functionality
    Current Implementation Analysis
      ✓ can subscribe to a channel (31 ms)
      ✓ can unsubscribe from a channel (33 ms)
      ✓ can publish a message (7 ms)
      ✓ subscription events are emitted (44 ms)
      ✓ pattern subscription works (33 ms)
    Message Reception (Current Gap)
      ✓ should receive messages (CURRENTLY FAILING - EXPECTED) (307 ms)
      ✓ should receive pattern messages (CURRENTLY FAILING - EXPECTED) (235 ms)
    Bull Integration Requirements
      ✓ multiple subscriptions to same channel should work (39 ms)
      ✓ should handle subscription cleanup on disconnect (46 ms)

  console.log
    📤 DIRECT: Publishing message...

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:28:15)

  console.log
    📊 DIRECT: Publish result: 1 subscribers

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:30:15)

  console.log
    🔄 DIRECT: Polling for message...

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:33:15)

  console.log
    📨 DIRECT: Received message: { channel: 'direct-test', message: 'hello direct world' }

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:41:19)

  console.log
    📊 DIRECT: Message received: true

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:49:15)

  console.log
    ✅ DIRECT: SUCCESS - Direct utilities work!

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:51:17)

  console.log
    📤 DIRECT: Publishing to pattern...

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:78:15)

  console.log
    📊 DIRECT: Pattern publish result: 1 subscribers

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:80:15)

  console.log
    🔄 DIRECT: Polling for pattern message...

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:83:15)

  console.log
    📨 DIRECT: Received pattern message: {
      channel: 'direct.news',
      message: 'pattern message',
      pattern: 'direct.*'
    }

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:90:19)

  console.log
    📊 DIRECT: Pattern message received: true

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:98:15)

  console.log
    ✅ DIRECT: SUCCESS - Pattern subscriptions work!

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:100:17)

  console.log
    📤 BULL: Publishing Bull message...

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:130:15)

  console.log
    📊 BULL: Bull publish result: 1 subscribers

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:132:15)

  console.log
    ✅ BULL: Bull integration helper created successfully

      at Object.<anonymous> (tests/unit/direct-glide-pubsub.test.ts:137:15)

  console.error
    Error polling for message: ClosingError: 
        at /home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6494:20
        at Array.forEach (<anonymous>)
        at GlideClient.close (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6493:28)
        at cleanupPubSubClients (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:159:22)
        at LibraryGlideIntegration.cleanup (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/src/pubsub/DirectGlidePubSub.ts:306:7)
        at Object.<anonymous> (/home/runner/work/valkey-glide-ioredis-adapter/valkey-glide-ioredis-adapter/tests/unit/direct-glide-pubsub.test.ts:141:25)

      113 |     return null;
      114 |   } catch (error) {
    > 115 |     console.error('Error polling for message:', error);
          |             ^
      116 |     return null;
      117 |   }
      118 | }

      at pollForMessage (src/pubsub/DirectGlidePubSub.ts:115:13)
      at Immediate.poll (src/pubsub/DirectGlidePubSub.ts:252:23)

PASS tests/unit/direct-glide-pubsub.test.ts
  Direct GLIDE Pub/Sub
    ✓ basic pub/sub with direct utilities (228 ms)
    ✓ pattern subscription with direct utilities (214 ms)
    ✓ Bull integration helper (825 ms)

  console.log
    📤 Publishing message...

      at Object.<anonymous> (tests/unit/pubsub-polling.test.ts:74:13)

  console.log
    📊 Publish result: 1 subscribers

      at Object.<anonymous> (tests/unit/pubsub-polling.test.ts:76:13)

  console.log
    📨 Polling received message: {
      channel: 'polling-test',
      message: 'hello polling world',
      pattern: undefined
    }

      at tests/unit/pubsub-polling.test.ts:49:21

  console.log
    📊 Message received: true

      at Object.<anonymous> (tests/unit/pubsub-polling.test.ts:83:13)

  console.log
    📨 Received channel: polling-test

      at Object.<anonymous> (tests/unit/pubsub-polling.test.ts:85:15)

  console.log
    📨 Received message: hello polling world

      at Object.<anonymous> (tests/unit/pubsub-polling.test.ts:86:15)

  console.log
    📊 Active channels: [
      'bull:test-bull-queue:delayed',
      'bull:custom-client-queue:delayed',
      'test-channel',
      'bull:job:failed',
      'polling-test',
      'bull:queue:events',
      'bull:test-bull-stats:delayed',
      'bull:shared-client-queue:delayed',
      'socket.io-request#/#,socket.io-response#/#,socket.io-response#/#-mzbvm#',
      'socket.io-request#/#,socket.io-response#/#,socket.io-response#/#B_bwAv#',
      'direct-test',
      'bull:job:completed'
    ]

      at Object.<anonymous> (tests/unit/pubsub-polling.test.ts:101:13)

  console.log
    📊 Subscription count: [ { channel: 'polling-test', numSub: 1 } ]

      at Object.<anonymous> (tests/unit/pubsub-polling.test.ts:104:13)

  console.log
    ✅ Subscription confirmed: { channel: 'polling-test', numSub: 1 }

      at Object.<anonymous> (tests/unit/pubsub-polling.test.ts:113:15)

PASS tests/unit/pubsub-polling.test.ts
  GLIDE Pub/Sub Polling Approach
    ✓ should receive messages using getPubSubMessage() polling (107 ms)
    ✓ should verify subscription is established (4 ms)

  console.log
    🔧 DEBUG: subscribedChannels Set: Set(1) { 'dynamic-test' }

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:30:13)

  console.log
    🔧 DEBUG: subscribedChannels Array.from: [ 'dynamic-test' ]

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:31:13)

  console.log
    🔧 DEBUG: exactChannels Set: Set(1) { 'dynamic-test' }

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:45:15)

  console.log
    🔧 DEBUG: Final config channelsAndPatterns: { '0': Set(1) { 'dynamic-test' } }

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:52:13)

  console.log
    🔧 DEBUG: Subscription client created, waiting...

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:58:13)

  console.log
    📤 DEBUG: Publishing message...

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:62:13)

  console.log
    📊 DEBUG: Publish result: 1 subscribers

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:64:13)

  console.log
    🔄 DEBUG: Polling for message...

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:67:13)

  console.log
    📨 DEBUG: Got message: { message: 'hello dynamic', channel: 'dynamic-test', pattern: null }

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:80:19)

  console.log
    📊 DEBUG: Message received: true

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:94:13)

  console.log
    ✅ DEBUG: SUCCESS - Dynamic pattern works!

      at Object.<anonymous> (tests/unit/glide-dynamic-debug.test.ts:96:15)

PASS tests/unit/glide-dynamic-debug.test.ts
  GLIDE Dynamic Debug
    ✓ dynamic client creation with exact working pattern (232 ms)

PASS tests/integration/simple-adapter.test.ts
  Simple Adapter Integration Test
    ✓ should connect and ping successfully (12 ms)
    ✓ should perform basic string operations (11 ms)
    ✓ should handle multiple operations (11 ms)
    ✓ should work with hash operations (13 ms)
    ✓ should work with list operations (11 ms)
    ✓ should work with keys pattern matching (12 ms)

  console.log
    🔧 DEBUG: Clients created, waiting for subscription to establish...

      at Object.<anonymous> (tests/unit/glide-single-client-debug.test.ts:40:13)

  console.log
    📤 DEBUG: Publishing message...

      at Object.<anonymous> (tests/unit/glide-single-client-debug.test.ts:44:13)

  console.log
    📊 DEBUG: Publish result: 1 subscribers

      at Object.<anonymous> (tests/unit/glide-single-client-debug.test.ts:46:13)

  console.log
    🔄 DEBUG: Polling for message...

      at Object.<anonymous> (tests/unit/glide-single-client-debug.test.ts:49:13)

  console.log
    📨 DEBUG: Got message: {
      message: 'hello single client',
      channel: 'single-client-test',
      pattern: null
    }

      at Object.<anonymous> (tests/unit/glide-single-client-debug.test.ts:62:19)

  console.log
    📊 DEBUG: Message received: true

      at Object.<anonymous> (tests/unit/glide-single-client-debug.test.ts:76:13)

  console.log
    ✅ DEBUG: SUCCESS - Single client pattern works!

      at Object.<anonymous> (tests/unit/glide-single-client-debug.test.ts:78:15)

PASS tests/unit/glide-single-client-debug.test.ts
  GLIDE Single Client Debug
    ✓ replicate exact working pattern from simple polling test (231 ms)

PASS tests/unit/transaction-commands.test.ts
  Transaction Commands
    ✓ should watch and unwatch keys (8 ms)
    ✓ should execute transaction with multi/exec (9 ms)
    ✓ should handle transaction with watched key modification (8 ms)

  console.log
    🔧 DEBUG: PubSubChannelModes.Exact value: 0

      at Object.<anonymous> (tests/unit/glide-config-debug.test.ts:9:13)

  console.log
    🔧 DEBUG: PubSubChannelModes.Pattern value: 1

      at Object.<anonymous> (tests/unit/glide-config-debug.test.ts:10:13)

  console.log
    🔧 DEBUG: Test Set: Set(1) { 'debug-channel' }

      at Object.<anonymous> (tests/unit/glide-config-debug.test.ts:14:13)

  console.log
    🔧 DEBUG: Test Set JSON: {}

      at Object.<anonymous> (tests/unit/glide-config-debug.test.ts:15:13)

  console.log
    🔧 DEBUG: Test Set Array.from: [ 'debug-channel' ]

      at Object.<anonymous> (tests/unit/glide-config-debug.test.ts:16:13)

  console.log
    🔧 DEBUG: Our config approach: {
      "addresses": [
        {
          "host": "localhost",
          "port": 6379
        }
      ],
      "pubsubSubscriptions": {
        "channelsAndPatterns": {
          "0": {}
        }
      }
    }

      at Object.<anonymous> (tests/unit/glide-config-debug.test.ts:30:13)

  console.log
    🔧 DEBUG: Direct config approach: {
      "addresses": [
        {
          "host": "localhost",
          "port": 6379
        }
      ],
      "pubsubSubscriptions": {
        "channelsAndPatterns": {
          "0": {}
        }
      }
    }

      at Object.<anonymous> (tests/unit/glide-config-debug.test.ts:42:13)

PASS tests/unit/glide-config-debug.test.ts
  GLIDE Config Debug
    ✓ debug configuration construction (7 ms)

PASS tests/unit/smoke.test.ts
  RedisAdapter Basic Functionality
    ✓ should create adapter instance (4 ms)
    ✓ should create adapter with port and host (2 ms)
    ✓ should create adapter with options object (1 ms)
    ✓ should parse redis URL (1 ms)
    ✓ should be an event emitter (1 ms)

Summary of all failing tests
FAIL tests/unit/redis-adapter-edge-cases.test.ts
  ● Test suite failed to run

    tests/unit/redis-adapter-edge-cases.test.ts:635:13 - error TS6133: 'hllKey' is declared but its value is never read.

    635       const hllKey = 'test:hll:unique:visitors';
                    ~~~~~~

FAIL tests/unit/pubsub-patterns.test.ts
  ● Test suite failed to run

    tests/unit/pubsub-patterns.test.ts:108:34 - error TS6133: 'pattern' is declared but its value is never read.

    108       subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
                                         ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:153:34 - error TS6133: 'pattern' is declared but its value is never read.

    153       subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
                                         ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:250:36 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    250       const joinEvent = JSON.parse(voiceUpdates[0]);
                                           ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:254:36 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    254       const muteEvent = JSON.parse(voiceUpdates[1]);
                                           ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:258:37 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    258       const leaveEvent = JSON.parse(voiceUpdates[2]);
                                            ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:303:39 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    303       const firstMessage = JSON.parse(chatMessages[0]);
                                              ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:308:37 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    308       const modMessage = JSON.parse(chatMessages[2]);
                                            ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:356:36 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    356       const liveEvent = JSON.parse(streamEvents[0]);
                                           ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:360:40 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    360       const followerEvent = JSON.parse(streamEvents[1]);
                                               ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:364:36 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    364       const raidEvent = JSON.parse(streamEvents[2]);
                                           ~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:377:34 - error TS6133: 'pattern' is declared but its value is never read.

    377       subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
                                         ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:454:34 - error TS6133: 'pattern' is declared but its value is never read.

    454       subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
                                         ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:515:33 - error TS6133: 'channel' is declared but its value is never read.

    515       subscriber.on('message', (channel: string, message: string) => {
                                        ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:546:37 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    546       const priceAlert = JSON.parse(alerts[0]);
                                            ~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:551:38 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    551       const volumeAlert = JSON.parse(alerts[1]);
                                             ~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:564:33 - error TS6133: 'channel' is declared but its value is never read.

    564       subscriber.on('message', (channel: string, message: string) => {
                                        ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:608:14 - error TS2532: Object is possibly 'undefined'.

    608       expect(patternMessages[0].message).toBe('matching message');
                     ~~~~~~~~~~~~~~~~~~
    tests/unit/pubsub-patterns.test.ts:651:33 - error TS6133: 'channel' is declared but its value is never read.

    651       subscriber.on('message', (channel: string, message: string) => {
                                        ~~~~~~~
    tests/unit/pubsub-patterns.test.ts:672:35 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
      Type 'undefined' is not assignable to type 'string'.

    672       const received = JSON.parse(largeMessages[0]);
                                          ~~~~~~~~~~~~~~~~

FAIL tests/unit/parameter-translation.test.ts
  ● Test suite failed to run

    tests/unit/parameter-translation.test.ts:18:47 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    18       const emptyResult = ParameterTranslator.translateStringParameters('');
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:22:52 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    22       const whitespaceResult = ParameterTranslator.translateStringParameters('   ');
                                                          ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:26:51 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    26       const multilineResult = ParameterTranslator.translateStringParameters('line1\\nline2\\nline3');
                                                         ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:32:47 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    32       const emojiResult = ParameterTranslator.translateStringParameters('Hello �� World ��');
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:36:49 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    36       const chineseResult = ParameterTranslator.translateStringParameters('你好世界');
                                                       ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:40:48 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    40       const arabicResult = ParameterTranslator.translateStringParameters('مرحبا بالعالم');
                                                      ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:44:54 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    44       const specialCharsResult = ParameterTranslator.translateStringParameters('key:with"quotes\'and\\backslashes');
                                                            ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:51:42 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    51       const result = ParameterTranslator.translateStringParameters(longString);
                                                ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:58:40 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    58       expect(() => ParameterTranslator.translateStringParameters(null as any)).not.toThrow();
                                              ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:59:40 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    59       expect(() => ParameterTranslator.translateStringParameters(undefined as any)).not.toThrow();
                                              ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:66:45 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    66       const intResult = ParameterTranslator.translateNumericParameters(42);
                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:70:47 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    70       const floatResult = ParameterTranslator.translateNumericParameters(3.14159);
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:74:50 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    74       const negativeResult = ParameterTranslator.translateNumericParameters(-100);
                                                        ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:78:46 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    78       const zeroResult = ParameterTranslator.translateNumericParameters(0);
                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:84:47 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    84       const largeResult = ParameterTranslator.translateNumericParameters(Number.MAX_SAFE_INTEGER);
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:88:47 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    88       const smallResult = ParameterTranslator.translateNumericParameters(Number.MIN_SAFE_INTEGER);
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:92:52 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    92       const scientificResult = ParameterTranslator.translateNumericParameters(1e10);
                                                          ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:98:45 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    98       const infResult = ParameterTranslator.translateNumericParameters(Infinity);
                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:101:48 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    101       const negInfResult = ParameterTranslator.translateNumericParameters(-Infinity);
                                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:105:45 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    105       const nanResult = ParameterTranslator.translateNumericParameters(NaN);
                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:111:54 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    111       const stringNumberResult = ParameterTranslator.translateNumericParameters('123' as any);
                                                             ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:116:55 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    116       const decimalStringResult = ParameterTranslator.translateNumericParameters('45.67' as any);
                                                              ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:125:42 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    125       const result = ParameterTranslator.translateArrayParameters(mixedArray);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:137:42 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    137       const result = ParameterTranslator.translateArrayParameters(nestedArray);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:144:47 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    144       const emptyResult = ParameterTranslator.translateArrayParameters([]);
                                                      ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:152:42 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    152       const result = ParameterTranslator.translateArrayParameters(sparseArray);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:163:42 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    163       const result = ParameterTranslator.translateArrayParameters(largeArray);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:189:42 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    189       const result = ParameterTranslator.translateObjectParameters(complexObject);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:205:42 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    205       const result = ParameterTranslator.translateObjectParameters(specialKeyObject);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:218:29 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    218         ParameterTranslator.translateObjectParameters(circularObj);
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:230:42 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    230       const result = ParameterTranslator.translateObjectParameters(objWithFunctions);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:240:42 - error TS2339: Property 'translateHashSetParameters' does not exist on type 'typeof ParameterTranslator'.

    240       const result = ParameterTranslator.translateHashSetParameters(hmsetArgs);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:262:42 - error TS2339: Property 'translateHashSetParameters' does not exist on type 'typeof ParameterTranslator'.

    262       const result = ParameterTranslator.translateHashSetParameters([key, fields]);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:268:45 - error TS2339: Property 'translateHashSetParameters' does not exist on type 'typeof ParameterTranslator'.

    268       const emptyHash = ParameterTranslator.translateHashSetParameters(['key:empty']);
                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:278:42 - error TS2551: Property 'translateSetParameters' does not exist on type 'typeof ParameterTranslator'. Did you mean 'translateSetArgs'?

    278       const result = ParameterTranslator.translateSetParameters(['following:user:abc', ...followers]);
                                                 ~~~~~~~~~~~~~~~~~~~~~~

      src/utils/ParameterTranslator.ts:15:10
        15   static translateSetArgs(args: any[]): {
                    ~~~~~~~~~~~~~~~~
        'translateSetArgs' is declared here.
    tests/unit/parameter-translation.test.ts:288:42 - error TS2551: Property 'translateSetParameters' does not exist on type 'typeof ParameterTranslator'. Did you mean 'translateSetArgs'?

    288       const result = ParameterTranslator.translateSetParameters(['tags:post:123', ...tags]);
                                                 ~~~~~~~~~~~~~~~~~~~~~~

      src/utils/ParameterTranslator.ts:15:10
        15   static translateSetArgs(args: any[]): {
                    ~~~~~~~~~~~~~~~~
        'translateSetArgs' is declared here.
    tests/unit/parameter-translation.test.ts:308:42 - error TS2339: Property 'translateScoreParameters' does not exist on type 'typeof ParameterTranslator'.

    308       const result = ParameterTranslator.translateScoreParameters(zaddArgs);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:326:42 - error TS2339: Property 'translateScoreParameters' does not exist on type 'typeof ParameterTranslator'.

    326       const result = ParameterTranslator.translateScoreParameters(timelineArgs);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:341:42 - error TS2339: Property 'translateScoreParameters' does not exist on type 'typeof ParameterTranslator'.

    341       const result = ParameterTranslator.translateScoreParameters(preciseArgs);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:351:48 - error TS2339: Property 'translateRangeParameters' does not exist on type 'typeof ParameterTranslator'.

    351       const numericRange = ParameterTranslator.translateRangeParameters([0, -1]);
                                                       ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:356:46 - error TS2339: Property 'translateRangeParameters' does not exist on type 'typeof ParameterTranslator'.

    356       const scoreRange = ParameterTranslator.translateRangeParameters(['0', '+inf']);
                                                     ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:371:44 - error TS2339: Property 'translateRangeParameters' does not exist on type 'typeof ParameterTranslator'.

    371         const result = ParameterTranslator.translateRangeParameters(range);
                                                   ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:379:47 - error TS2339: Property 'translateRangeParameters' does not exist on type 'typeof ParameterTranslator'.

    379       const limitParams = ParameterTranslator.translateRangeParameters(['LIMIT', 10, 20]);
                                                      ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:390:50 - error TS2339: Property 'translateCommandOptions' does not exist on type 'typeof ParameterTranslator'.

    390       const setWithOptions = ParameterTranslator.translateCommandOptions(['key', 'value', 'EX', 300, 'NX']);
                                                         ~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:399:47 - error TS2339: Property 'translateCommandOptions' does not exist on type 'typeof ParameterTranslator'.

    399       const scanOptions = ParameterTranslator.translateCommandOptions([0, 'MATCH', 'user:*', 'COUNT', 100]);
                                                      ~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:409:47 - error TS2339: Property 'translateCommandOptions' does not exist on type 'typeof ParameterTranslator'.

    409       const sortOptions = ParameterTranslator.translateCommandOptions([
                                                      ~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:423:40 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    423       expect(() => ParameterTranslator.translateStringParameters(null as any)).not.toThrow();
                                               ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:424:40 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    424       expect(() => ParameterTranslator.translateNumericParameters(undefined as any)).not.toThrow();
                                               ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:425:40 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    425       expect(() => ParameterTranslator.translateArrayParameters(null as any)).not.toThrow();
                                               ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:430:40 - error TS2339: Property 'translateNumericParameters' does not exist on type 'typeof ParameterTranslator'.

    430       expect(() => ParameterTranslator.translateNumericParameters('not-a-number' as any)).not.toThrow();
                                               ~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:431:40 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    431       expect(() => ParameterTranslator.translateArrayParameters('not-an-array' as any)).not.toThrow();
                                               ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:438:29 - error TS2339: Property 'translateArrayParameters' does not exist on type 'typeof ParameterTranslator'.

    438         ParameterTranslator.translateArrayParameters(largeParamSet);
                                    ~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:445:42 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    445       const result = ParameterTranslator.translateStringParameters(controlChars);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:453:29 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    453         ParameterTranslator.translateStringParameters(binaryData.toString('binary'));
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:461:29 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    461         ParameterTranslator.translateStringParameters(longKey);
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:469:29 - error TS2339: Property 'translateStringParameters' does not exist on type 'typeof ParameterTranslator'.

    469         ParameterTranslator.translateStringParameters(malformedJson);
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:483:42 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    483       const result = ParameterTranslator.translateObjectParameters(largeObject);
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/parameter-translation.test.ts:501:29 - error TS2339: Property 'translateObjectParameters' does not exist on type 'typeof ParameterTranslator'.

    501         ParameterTranslator.translateObjectParameters(deepObject);
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~

FAIL tests/unit/cluster-operations.test.ts
  ● Test suite failed to run

    tests/unit/cluster-operations.test.ts:14:10 - error TS2724: '"../../src/types"' has no exported member named 'RedisClusterOptions'. Did you mean 'ClusterOptions'?

    14 import { RedisClusterOptions } from '../../src/types';
                ~~~~~~~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:26:15 - error TS2511: Cannot create an instance of an abstract class.

    26     cluster = new BaseClusterAdapter(config);
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:49:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    49       await cluster.zadd(timelineKey1, now - 3600, 'tweet:1001');
                           ~~~~
    tests/unit/cluster-operations.test.ts:50:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    50       await cluster.zadd(timelineKey1, now - 1800, 'tweet:1002');
                           ~~~~
    tests/unit/cluster-operations.test.ts:51:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    51       await cluster.zadd(timelineKey1, now, 'tweet:1003');
                           ~~~~
    tests/unit/cluster-operations.test.ts:53:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    53       await cluster.zadd(timelineKey2, now - 2400, 'tweet:2001');
                           ~~~~
    tests/unit/cluster-operations.test.ts:54:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    54       await cluster.zadd(timelineKey2, now - 600, 'tweet:2002');
                           ~~~~
    tests/unit/cluster-operations.test.ts:56:21 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    56       await cluster.zadd(timelineKey3, now - 900, 'tweet:3001');
                           ~~~~
    tests/unit/cluster-operations.test.ts:59:39 - error TS2339: Property 'zrevrange' does not exist on type 'BaseClusterAdapter'.

    59       const timeline1 = await cluster.zrevrange(timelineKey1, 0, -1);
                                             ~~~~~~~~~
    tests/unit/cluster-operations.test.ts:62:39 - error TS2339: Property 'zrevrange' does not exist on type 'BaseClusterAdapter'.

    62       const timeline2 = await cluster.zrevrange(timelineKey2, 0, -1);
                                             ~~~~~~~~~
    tests/unit/cluster-operations.test.ts:65:44 - error TS2339: Property 'zcard' does not exist on type 'BaseClusterAdapter'.

    65       const timeline3Count = await cluster.zcard(timelineKey3);
                                                  ~~~~~
    tests/unit/cluster-operations.test.ts:76:23 - error TS2339: Property 'incrby' does not exist on type 'BaseClusterAdapter'.

    76         await cluster.incrby(key, Math.floor(Math.random() * 1000) + 100);
                             ~~~~~~
    tests/unit/cluster-operations.test.ts:81:37 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    81         const count = await cluster.get(`trending:${hashtag}`);
                                           ~~~
    tests/unit/cluster-operations.test.ts:94:23 - error TS2339: Property 'hmset' does not exist on type 'BaseClusterAdapter'.

    94         await cluster.hmset(photoId, {
                             ~~~~~
    tests/unit/cluster-operations.test.ts:108:40 - error TS2339: Property 'hgetall' does not exist on type 'BaseClusterAdapter'.

    108         const metadata = await cluster.hgetall(photoId);
                                               ~~~~~~~
    tests/unit/cluster-operations.test.ts:116:41 - error TS2339: Property 'hget' does not exist on type 'BaseClusterAdapter'.

    116       const photo1Likes = await cluster.hget(photoIds[0], 'likes');
                                                ~~~~
    tests/unit/cluster-operations.test.ts:117:40 - error TS2339: Property 'hget' does not exist on type 'BaseClusterAdapter'.

    117       const photo2User = await cluster.hget(photoIds[1], 'user_id');
                                               ~~~~
    tests/unit/cluster-operations.test.ts:136:23 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    136         await cluster.zadd(userPhotosKey, photo.timestamp, photo.id);
                              ~~~~
    tests/unit/cluster-operations.test.ts:140:42 - error TS2339: Property 'zrevrange' does not exist on type 'BaseClusterAdapter'.

    140       const recentPhotos = await cluster.zrevrange(userPhotosKey, 0, 1);
                                                 ~~~~~~~~~
    tests/unit/cluster-operations.test.ts:145:39 - error TS2339: Property 'zrangebyscore' does not exist on type 'BaseClusterAdapter'.

    145       const dayPhotos = await cluster.zrangebyscore(userPhotosKey, oneDayAgo, Date.now());
                                              ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:161:25 - error TS2339: Property 'lpush' does not exist on type 'BaseClusterAdapter'.

    161           await cluster.lpush(messageKey,
                                ~~~~~
    tests/unit/cluster-operations.test.ts:170:25 - error TS2339: Property 'lpush' does not exist on type 'BaseClusterAdapter'.

    170           await cluster.lpush(messageKey,
                                ~~~~~
    tests/unit/cluster-operations.test.ts:180:25 - error TS2339: Property 'ltrim' does not exist on type 'BaseClusterAdapter'.

    180           await cluster.ltrim(messageKey, 0, 49);
                                ~~~~~
    tests/unit/cluster-operations.test.ts:186:38 - error TS2339: Property 'lrange' does not exist on type 'BaseClusterAdapter'.

    186       const messages = await cluster.lrange(testChannel, 0, 4);
                                             ~~~~~~
    tests/unit/cluster-operations.test.ts:205:23 - error TS2339: Property 'sadd' does not exist on type 'BaseClusterAdapter'.

    205         await cluster.sadd(presenceKey, 'user123', 'user456', 'user789');
                              ~~~~
    tests/unit/cluster-operations.test.ts:208:23 - error TS2339: Property 'expire' does not exist on type 'BaseClusterAdapter'.

    208         await cluster.expire(presenceKey, 3600); // 1 hour
                              ~~~~~~
    tests/unit/cluster-operations.test.ts:212:42 - error TS2339: Property 'smembers' does not exist on type 'BaseClusterAdapter'.

    212       const generalUsers = await cluster.smembers(`voice:${guildId}:General`);
                                                 ~~~~~~~~
    tests/unit/cluster-operations.test.ts:217:40 - error TS2339: Property 'scard' does not exist on type 'BaseClusterAdapter'.

    217       const musicCount = await cluster.scard(`voice:${guildId}:Music`);
                                               ~~~~~
    tests/unit/cluster-operations.test.ts:221:37 - error TS2339: Property 'srem' does not exist on type 'BaseClusterAdapter'.

    221       const removed = await cluster.srem(`voice:${guildId}:Gaming`, 'user456');
                                            ~~~~
    tests/unit/cluster-operations.test.ts:224:44 - error TS2339: Property 'scard' does not exist on type 'BaseClusterAdapter'.

    224       const remainingCount = await cluster.scard(`voice:${guildId}:Gaming`);
                                                   ~~~~~
    tests/unit/cluster-operations.test.ts:239:23 - error TS2339: Property 'hmset' does not exist on type 'BaseClusterAdapter'.

    239         await cluster.hmset(session.id, {
                              ~~~~~
    tests/unit/cluster-operations.test.ts:250:23 - error TS2339: Property 'expire' does not exist on type 'BaseClusterAdapter'.

    250         await cluster.expire(session.id, 86400);
                              ~~~~~~
    tests/unit/cluster-operations.test.ts:255:43 - error TS2339: Property 'hgetall' does not exist on type 'BaseClusterAdapter'.

    255         const sessionData = await cluster.hgetall(session.id);
                                                  ~~~~~~~
    tests/unit/cluster-operations.test.ts:260:35 - error TS2339: Property 'ttl' does not exist on type 'BaseClusterAdapter'.

    260         const ttl = await cluster.ttl(session.id);
                                          ~~~
    tests/unit/cluster-operations.test.ts:266:21 - error TS2339: Property 'hset' does not exist on type 'BaseClusterAdapter'.

    266       await cluster.hset(activeSession.id, 'last_activity', Date.now().toString());
                            ~~~~
    tests/unit/cluster-operations.test.ts:266:26 - error TS18048: 'activeSession' is possibly 'undefined'.

    266       await cluster.hset(activeSession.id, 'last_activity', Date.now().toString());
                                 ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:267:21 - error TS2339: Property 'expire' does not exist on type 'BaseClusterAdapter'.

    267       await cluster.expire(activeSession.id, 86400); // Reset TTL
                            ~~~~~~
    tests/unit/cluster-operations.test.ts:267:28 - error TS18048: 'activeSession' is possibly 'undefined'.

    267       await cluster.expire(activeSession.id, 86400); // Reset TTL
                                   ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:269:45 - error TS2339: Property 'hget' does not exist on type 'BaseClusterAdapter'.

    269       const updatedActivity = await cluster.hget(activeSession.id, 'last_activity');
                                                    ~~~~
    tests/unit/cluster-operations.test.ts:269:50 - error TS18048: 'activeSession' is possibly 'undefined'.

    269       const updatedActivity = await cluster.hget(activeSession.id, 'last_activity');
                                                         ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:286:23 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    286         await cluster.zadd(viewingHistoryKey, show.timestamp, show.title);
                              ~~~~
    tests/unit/cluster-operations.test.ts:290:43 - error TS2339: Property 'zrevrange' does not exist on type 'BaseClusterAdapter'.

    290       const recentHistory = await cluster.zrevrange(viewingHistoryKey, 0, 2);
                                                  ~~~~~~~~~
    tests/unit/cluster-operations.test.ts:299:41 - error TS2339: Property 'zrangebyscore' does not exist on type 'BaseClusterAdapter'.

    299       const recentViews = await cluster.zrangebyscore(viewingHistoryKey, twoHoursAgo, Date.now());
                                                ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:315:23 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    315         await cluster.set(testKeys[i], `value_${i}`);
                              ~~~
    tests/unit/cluster-operations.test.ts:320:37 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    320         const value = await cluster.get(testKeys[i]);
                                            ~~~
    tests/unit/cluster-operations.test.ts:325:36 - error TS2339: Property 'mget' does not exist on type 'BaseClusterAdapter'.

    325       const values = await cluster.mget(testKeys);
                                           ~~~~
    tests/unit/cluster-operations.test.ts:336:43 - error TS2339: Property 'cluster' does not exist on type 'BaseClusterAdapter'.

    336         const clusterInfo = await cluster.cluster('INFO');
                                                  ~~~~~~~
    tests/unit/cluster-operations.test.ts:345:44 - error TS2339: Property 'cluster' does not exist on type 'BaseClusterAdapter'.

    345         const clusterNodes = await cluster.cluster('NODES');
                                                   ~~~~~~~
    tests/unit/cluster-operations.test.ts:360:21 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    360       await cluster.set(key1, 'value1');
                            ~~~
    tests/unit/cluster-operations.test.ts:361:21 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    361       await cluster.set(key2, 'value2');
                            ~~~
    tests/unit/cluster-operations.test.ts:362:21 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    362       await cluster.set(key3, 'value3');
                            ~~~
    tests/unit/cluster-operations.test.ts:365:36 - error TS2339: Property 'mget' does not exist on type 'BaseClusterAdapter'.

    365       const values = await cluster.mget([key1, key2, key3]);
                                           ~~~~
    tests/unit/cluster-operations.test.ts:369:41 - error TS2339: Property 'exists' does not exist on type 'BaseClusterAdapter'.

    369       const existsCount = await cluster.exists(key1, key2, key3);
                                                ~~~~~~
    tests/unit/cluster-operations.test.ts:386:25 - error TS2339: Property 'zadd' does not exist on type 'BaseClusterAdapter'.

    386           await cluster.zadd(eventKey, timestamp, eventId);
                                ~~~~
    tests/unit/cluster-operations.test.ts:389:25 - error TS2339: Property 'zremrangebyrank' does not exist on type 'BaseClusterAdapter'.

    389           await cluster.zremrangebyrank(eventKey, 0, -1001);
                                ~~~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:395:40 - error TS2339: Property 'zcard' does not exist on type 'BaseClusterAdapter'.

    395       const eventCount = await cluster.zcard(testUserEvents);
                                               ~~~~~
    tests/unit/cluster-operations.test.ts:400:42 - error TS2339: Property 'zrangebyscore' does not exist on type 'BaseClusterAdapter'.

    400       const recentEvents = await cluster.zrangebyscore(testUserEvents, oneHourAgo, Date.now());
                                                 ~~~~~~~~~~~~~
    tests/unit/cluster-operations.test.ts:416:23 - error TS2339: Property 'incrby' does not exist on type 'BaseClusterAdapter'.

    416         await cluster.incrby(dailyKey, incrementValue);
                              ~~~~~~
    tests/unit/cluster-operations.test.ts:419:23 - error TS2339: Property 'expire' does not exist on type 'BaseClusterAdapter'.

    419         await cluster.expire(dailyKey, 90 * 24 * 3600);
                              ~~~~~~
    tests/unit/cluster-operations.test.ts:425:37 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    425         const count = await cluster.get(dailyKey);
                                            ~~~
    tests/unit/cluster-operations.test.ts:431:39 - error TS2339: Property 'mget' does not exist on type 'BaseClusterAdapter'.

    431       const allCounts = await cluster.mget(metricKeys);
                                              ~~~~
    tests/unit/cluster-operations.test.ts:442:36 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    442       const result = await cluster.get('nonexistent:key');
                                           ~~~
    tests/unit/cluster-operations.test.ts:445:40 - error TS2339: Property 'hgetall' does not exist on type 'BaseClusterAdapter'.

    445       const hashResult = await cluster.hgetall('nonexistent:hash');
                                               ~~~~~~~
    tests/unit/cluster-operations.test.ts:448:40 - error TS2339: Property 'llen' does not exist on type 'BaseClusterAdapter'.

    448       const listLength = await cluster.llen('nonexistent:list');
                                               ~~~~
    tests/unit/cluster-operations.test.ts:456:21 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    456       await cluster.set(key, 'string_value');
                            ~~~
    tests/unit/cluster-operations.test.ts:459:28 - error TS2339: Property 'lpush' does not exist on type 'BaseClusterAdapter'.

    459       await expect(cluster.lpush(key, 'item')).rejects.toThrow();
                                   ~~~~~
    tests/unit/cluster-operations.test.ts:460:28 - error TS2339: Property 'sadd' does not exist on type 'BaseClusterAdapter'.

    460       await expect(cluster.sadd(key, 'member')).rejects.toThrow();
                                   ~~~~
    tests/unit/cluster-operations.test.ts:461:28 - error TS2339: Property 'hset' does not exist on type 'BaseClusterAdapter'.

    461       await expect(cluster.hset(key, 'field', 'value')).rejects.toThrow();
                                   ~~~~
    tests/unit/cluster-operations.test.ts:469:21 - error TS2339: Property 'set' does not exist on type 'BaseClusterAdapter'.

    469       await cluster.set(largeKey, largeValue);
                            ~~~
    tests/unit/cluster-operations.test.ts:470:39 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    470       const retrieved = await cluster.get(largeKey);
                                              ~~~
    tests/unit/cluster-operations.test.ts:481:31 - error TS2339: Property 'incr' does not exist on type 'BaseClusterAdapter'.

    481         promises.push(cluster.incr(concurrentKey));
                                      ~~~~
    tests/unit/cluster-operations.test.ts:494:40 - error TS2339: Property 'get' does not exist on type 'BaseClusterAdapter'.

    494       const finalValue = await cluster.get(concurrentKey);
                                               ~~~

FAIL tests/cluster/core/cluster-basic.test.ts
  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7002" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7002" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

  ● ClusterAdapter - Basic Tests › Error Handling › should handle connection errors gracefully

    Unhandled error. (ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6490:20
          at Array.forEach (<anonymous>)
      at GlideClusterClient.close (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6489:39)
      at GlideClusterClient.processResponse (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:349:18)
      at GlideClusterClient.handleReadData (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:264:22)
      at Socket.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:417:40)
      at Pipe.onStreamRead (node:internal/stream_base_commons:191:23))
      at src/adapters/BaseClusterAdapter.ts:54:16

FAIL tests/cluster/integrations/bull/bull-cluster.test.ts
  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

  ● Bull Integration with ClusterAdapter › Event Handling › should forward pub/sub events

    Unhandled error. ([ClosingError: Connection error: Cluster(Failed to create initial connections - IoError: Failed to refresh both connections - IoError: Node: "127.0.0.1:7000" received errors: `Connection refused (os error 111)`, `Connection refused (os error 111)`)])

      52 |       setImmediate(() => {
      53 |         this.connect().catch(err => {
    > 54 |           this.emit('error', err);
         |                ^
      55 |         });
      56 |       });
      57 |     }

      at src/adapters/BaseClusterAdapter.ts:54:16

FAIL tests/integration/socketio/redis-adapter.test.ts (64.756 s)
  ● Socket.IO Redis Adapter Integration › Basic Socket.IO Functionality › should connect and communicate with single instance

    listen EADDRINUSE: address already in use :::60000

      133 |
      134 |     await new Promise<void>((resolve) => {
    > 135 |       server2.listen(port2, resolve);
          |               ^
      136 |     });
      137 |
      138 |     // Wait for servers to be ready

      at tests/integration/socketio/redis-adapter.test.ts:135:15
      at Object.<anonymous> (tests/integration/socketio/redis-adapter.test.ts:134:11)

  ● Socket.IO Redis Adapter Integration › Basic Socket.IO Functionality › should connect and communicate with single instance

    thrown: "Exceeded timeout of 60000 ms for a hook.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      33 |   });
      34 |
    > 35 |   beforeEach(async () => {
         |   ^
      36 |     // Skip tests if servers are not available
      37 |     const serversAvailable = await testUtils.checkTestServers();
      38 |     if (!serversAvailable) {

      at tests/integration/socketio/redis-adapter.test.ts:35:3
      at Object.<anonymous> (tests/integration/socketio/redis-adapter.test.ts:15:1)


Test Suites: 7 failed, 34 passed, 41 total
Tests:       3 failed, 545 passed, 548 total
Snapshots:   0 total
Time:        128.977 s
Ran all test suites.

Jest has detected the following 1 open handle potentially keeping Jest from exiting:

  ●  CustomGC

      4 |  */
      5 |
    > 6 | import { Batch, GlideClient, Script, TimeUnit, RangeByScore, Boundary } from '@valkey/valkey-glide';
        | ^
      7 | import { EventEmitter } from 'events';
      8 | import { pack as msgpack } from 'msgpackr';
      9 | import {

      at Runtime._loadModule (node_modules/jest-runtime/build/index.js:940:29)
      at Object.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/native.js:203:45)
      at Object.<anonymous> (node_modules/@valkey/valkey-glide/build-ts/index.js:24:14)
      at Object.<anonymous> (src/adapters/RedisAdapter.ts:6:1)
      at Object.<anonymous> (tests/unit/stream-commands.test.ts:7:1