
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ProgramBantuan
 * 
 */
export type ProgramBantuan = $Result.DefaultSelection<Prisma.$ProgramBantuanPayload>
/**
 * Model DocumentField
 * 
 */
export type DocumentField = $Result.DefaultSelection<Prisma.$DocumentFieldPayload>
/**
 * Model BiodataField
 * 
 */
export type BiodataField = $Result.DefaultSelection<Prisma.$BiodataFieldPayload>
/**
 * Model Submission
 * 
 */
export type Submission = $Result.DefaultSelection<Prisma.$SubmissionPayload>
/**
 * Model SubmissionDocument
 * 
 */
export type SubmissionDocument = $Result.DefaultSelection<Prisma.$SubmissionDocumentPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more ProgramBantuans
 * const programBantuans = await prisma.programBantuan.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more ProgramBantuans
   * const programBantuans = await prisma.programBantuan.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.programBantuan`: Exposes CRUD operations for the **ProgramBantuan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProgramBantuans
    * const programBantuans = await prisma.programBantuan.findMany()
    * ```
    */
  get programBantuan(): Prisma.ProgramBantuanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.documentField`: Exposes CRUD operations for the **DocumentField** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DocumentFields
    * const documentFields = await prisma.documentField.findMany()
    * ```
    */
  get documentField(): Prisma.DocumentFieldDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.biodataField`: Exposes CRUD operations for the **BiodataField** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BiodataFields
    * const biodataFields = await prisma.biodataField.findMany()
    * ```
    */
  get biodataField(): Prisma.BiodataFieldDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.submission`: Exposes CRUD operations for the **Submission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Submissions
    * const submissions = await prisma.submission.findMany()
    * ```
    */
  get submission(): Prisma.SubmissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.submissionDocument`: Exposes CRUD operations for the **SubmissionDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubmissionDocuments
    * const submissionDocuments = await prisma.submissionDocument.findMany()
    * ```
    */
  get submissionDocument(): Prisma.SubmissionDocumentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.9.1
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ProgramBantuan: 'ProgramBantuan',
    DocumentField: 'DocumentField',
    BiodataField: 'BiodataField',
    Submission: 'Submission',
    SubmissionDocument: 'SubmissionDocument'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "programBantuan" | "documentField" | "biodataField" | "submission" | "submissionDocument"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ProgramBantuan: {
        payload: Prisma.$ProgramBantuanPayload<ExtArgs>
        fields: Prisma.ProgramBantuanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgramBantuanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgramBantuanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload>
          }
          findFirst: {
            args: Prisma.ProgramBantuanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgramBantuanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload>
          }
          findMany: {
            args: Prisma.ProgramBantuanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload>[]
          }
          create: {
            args: Prisma.ProgramBantuanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload>
          }
          createMany: {
            args: Prisma.ProgramBantuanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgramBantuanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload>[]
          }
          delete: {
            args: Prisma.ProgramBantuanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload>
          }
          update: {
            args: Prisma.ProgramBantuanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload>
          }
          deleteMany: {
            args: Prisma.ProgramBantuanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgramBantuanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProgramBantuanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload>[]
          }
          upsert: {
            args: Prisma.ProgramBantuanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramBantuanPayload>
          }
          aggregate: {
            args: Prisma.ProgramBantuanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgramBantuan>
          }
          groupBy: {
            args: Prisma.ProgramBantuanGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgramBantuanGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgramBantuanCountArgs<ExtArgs>
            result: $Utils.Optional<ProgramBantuanCountAggregateOutputType> | number
          }
        }
      }
      DocumentField: {
        payload: Prisma.$DocumentFieldPayload<ExtArgs>
        fields: Prisma.DocumentFieldFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFieldFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFieldFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload>
          }
          findFirst: {
            args: Prisma.DocumentFieldFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFieldFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload>
          }
          findMany: {
            args: Prisma.DocumentFieldFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload>[]
          }
          create: {
            args: Prisma.DocumentFieldCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload>
          }
          createMany: {
            args: Prisma.DocumentFieldCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentFieldCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload>[]
          }
          delete: {
            args: Prisma.DocumentFieldDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload>
          }
          update: {
            args: Prisma.DocumentFieldUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload>
          }
          deleteMany: {
            args: Prisma.DocumentFieldDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentFieldUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentFieldUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload>[]
          }
          upsert: {
            args: Prisma.DocumentFieldUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentFieldPayload>
          }
          aggregate: {
            args: Prisma.DocumentFieldAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocumentField>
          }
          groupBy: {
            args: Prisma.DocumentFieldGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentFieldGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentFieldCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentFieldCountAggregateOutputType> | number
          }
        }
      }
      BiodataField: {
        payload: Prisma.$BiodataFieldPayload<ExtArgs>
        fields: Prisma.BiodataFieldFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BiodataFieldFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BiodataFieldFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload>
          }
          findFirst: {
            args: Prisma.BiodataFieldFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BiodataFieldFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload>
          }
          findMany: {
            args: Prisma.BiodataFieldFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload>[]
          }
          create: {
            args: Prisma.BiodataFieldCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload>
          }
          createMany: {
            args: Prisma.BiodataFieldCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BiodataFieldCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload>[]
          }
          delete: {
            args: Prisma.BiodataFieldDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload>
          }
          update: {
            args: Prisma.BiodataFieldUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload>
          }
          deleteMany: {
            args: Prisma.BiodataFieldDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BiodataFieldUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BiodataFieldUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload>[]
          }
          upsert: {
            args: Prisma.BiodataFieldUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BiodataFieldPayload>
          }
          aggregate: {
            args: Prisma.BiodataFieldAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBiodataField>
          }
          groupBy: {
            args: Prisma.BiodataFieldGroupByArgs<ExtArgs>
            result: $Utils.Optional<BiodataFieldGroupByOutputType>[]
          }
          count: {
            args: Prisma.BiodataFieldCountArgs<ExtArgs>
            result: $Utils.Optional<BiodataFieldCountAggregateOutputType> | number
          }
        }
      }
      Submission: {
        payload: Prisma.$SubmissionPayload<ExtArgs>
        fields: Prisma.SubmissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubmissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubmissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          findFirst: {
            args: Prisma.SubmissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubmissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          findMany: {
            args: Prisma.SubmissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>[]
          }
          create: {
            args: Prisma.SubmissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          createMany: {
            args: Prisma.SubmissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubmissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>[]
          }
          delete: {
            args: Prisma.SubmissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          update: {
            args: Prisma.SubmissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          deleteMany: {
            args: Prisma.SubmissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubmissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubmissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>[]
          }
          upsert: {
            args: Prisma.SubmissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          aggregate: {
            args: Prisma.SubmissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubmission>
          }
          groupBy: {
            args: Prisma.SubmissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubmissionCountArgs<ExtArgs>
            result: $Utils.Optional<SubmissionCountAggregateOutputType> | number
          }
        }
      }
      SubmissionDocument: {
        payload: Prisma.$SubmissionDocumentPayload<ExtArgs>
        fields: Prisma.SubmissionDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubmissionDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubmissionDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload>
          }
          findFirst: {
            args: Prisma.SubmissionDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubmissionDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload>
          }
          findMany: {
            args: Prisma.SubmissionDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload>[]
          }
          create: {
            args: Prisma.SubmissionDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload>
          }
          createMany: {
            args: Prisma.SubmissionDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubmissionDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload>[]
          }
          delete: {
            args: Prisma.SubmissionDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload>
          }
          update: {
            args: Prisma.SubmissionDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload>
          }
          deleteMany: {
            args: Prisma.SubmissionDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubmissionDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubmissionDocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload>[]
          }
          upsert: {
            args: Prisma.SubmissionDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionDocumentPayload>
          }
          aggregate: {
            args: Prisma.SubmissionDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubmissionDocument>
          }
          groupBy: {
            args: Prisma.SubmissionDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubmissionDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubmissionDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<SubmissionDocumentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    programBantuan?: ProgramBantuanOmit
    documentField?: DocumentFieldOmit
    biodataField?: BiodataFieldOmit
    submission?: SubmissionOmit
    submissionDocument?: SubmissionDocumentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProgramBantuanCountOutputType
   */

  export type ProgramBantuanCountOutputType = {
    documentFields: number
    biodataFields: number
    submissions: number
  }

  export type ProgramBantuanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documentFields?: boolean | ProgramBantuanCountOutputTypeCountDocumentFieldsArgs
    biodataFields?: boolean | ProgramBantuanCountOutputTypeCountBiodataFieldsArgs
    submissions?: boolean | ProgramBantuanCountOutputTypeCountSubmissionsArgs
  }

  // Custom InputTypes
  /**
   * ProgramBantuanCountOutputType without action
   */
  export type ProgramBantuanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuanCountOutputType
     */
    select?: ProgramBantuanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProgramBantuanCountOutputType without action
   */
  export type ProgramBantuanCountOutputTypeCountDocumentFieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentFieldWhereInput
  }

  /**
   * ProgramBantuanCountOutputType without action
   */
  export type ProgramBantuanCountOutputTypeCountBiodataFieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BiodataFieldWhereInput
  }

  /**
   * ProgramBantuanCountOutputType without action
   */
  export type ProgramBantuanCountOutputTypeCountSubmissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubmissionWhereInput
  }


  /**
   * Count Type DocumentFieldCountOutputType
   */

  export type DocumentFieldCountOutputType = {
    documents: number
  }

  export type DocumentFieldCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | DocumentFieldCountOutputTypeCountDocumentsArgs
  }

  // Custom InputTypes
  /**
   * DocumentFieldCountOutputType without action
   */
  export type DocumentFieldCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentFieldCountOutputType
     */
    select?: DocumentFieldCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DocumentFieldCountOutputType without action
   */
  export type DocumentFieldCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubmissionDocumentWhereInput
  }


  /**
   * Count Type SubmissionCountOutputType
   */

  export type SubmissionCountOutputType = {
    documents: number
  }

  export type SubmissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | SubmissionCountOutputTypeCountDocumentsArgs
  }

  // Custom InputTypes
  /**
   * SubmissionCountOutputType without action
   */
  export type SubmissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionCountOutputType
     */
    select?: SubmissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubmissionCountOutputType without action
   */
  export type SubmissionCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubmissionDocumentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ProgramBantuan
   */

  export type AggregateProgramBantuan = {
    _count: ProgramBantuanCountAggregateOutputType | null
    _min: ProgramBantuanMinAggregateOutputType | null
    _max: ProgramBantuanMaxAggregateOutputType | null
  }

  export type ProgramBantuanMinAggregateOutputType = {
    id: string | null
    nama: string | null
    slug: string | null
    deskripsi: string | null
    gambarUrl: string | null
    status: string | null
    tanggalBuka: Date | null
    tanggalTutup: Date | null
    linkDriveTemplate: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgramBantuanMaxAggregateOutputType = {
    id: string | null
    nama: string | null
    slug: string | null
    deskripsi: string | null
    gambarUrl: string | null
    status: string | null
    tanggalBuka: Date | null
    tanggalTutup: Date | null
    linkDriveTemplate: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgramBantuanCountAggregateOutputType = {
    id: number
    nama: number
    slug: number
    deskripsi: number
    gambarUrl: number
    status: number
    tanggalBuka: number
    tanggalTutup: number
    linkDriveTemplate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProgramBantuanMinAggregateInputType = {
    id?: true
    nama?: true
    slug?: true
    deskripsi?: true
    gambarUrl?: true
    status?: true
    tanggalBuka?: true
    tanggalTutup?: true
    linkDriveTemplate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgramBantuanMaxAggregateInputType = {
    id?: true
    nama?: true
    slug?: true
    deskripsi?: true
    gambarUrl?: true
    status?: true
    tanggalBuka?: true
    tanggalTutup?: true
    linkDriveTemplate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgramBantuanCountAggregateInputType = {
    id?: true
    nama?: true
    slug?: true
    deskripsi?: true
    gambarUrl?: true
    status?: true
    tanggalBuka?: true
    tanggalTutup?: true
    linkDriveTemplate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProgramBantuanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProgramBantuan to aggregate.
     */
    where?: ProgramBantuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramBantuans to fetch.
     */
    orderBy?: ProgramBantuanOrderByWithRelationInput | ProgramBantuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgramBantuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramBantuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramBantuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProgramBantuans
    **/
    _count?: true | ProgramBantuanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgramBantuanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgramBantuanMaxAggregateInputType
  }

  export type GetProgramBantuanAggregateType<T extends ProgramBantuanAggregateArgs> = {
        [P in keyof T & keyof AggregateProgramBantuan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgramBantuan[P]>
      : GetScalarType<T[P], AggregateProgramBantuan[P]>
  }




  export type ProgramBantuanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramBantuanWhereInput
    orderBy?: ProgramBantuanOrderByWithAggregationInput | ProgramBantuanOrderByWithAggregationInput[]
    by: ProgramBantuanScalarFieldEnum[] | ProgramBantuanScalarFieldEnum
    having?: ProgramBantuanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgramBantuanCountAggregateInputType | true
    _min?: ProgramBantuanMinAggregateInputType
    _max?: ProgramBantuanMaxAggregateInputType
  }

  export type ProgramBantuanGroupByOutputType = {
    id: string
    nama: string
    slug: string
    deskripsi: string | null
    gambarUrl: string | null
    status: string
    tanggalBuka: Date | null
    tanggalTutup: Date | null
    linkDriveTemplate: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProgramBantuanCountAggregateOutputType | null
    _min: ProgramBantuanMinAggregateOutputType | null
    _max: ProgramBantuanMaxAggregateOutputType | null
  }

  type GetProgramBantuanGroupByPayload<T extends ProgramBantuanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgramBantuanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgramBantuanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgramBantuanGroupByOutputType[P]>
            : GetScalarType<T[P], ProgramBantuanGroupByOutputType[P]>
        }
      >
    >


  export type ProgramBantuanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nama?: boolean
    slug?: boolean
    deskripsi?: boolean
    gambarUrl?: boolean
    status?: boolean
    tanggalBuka?: boolean
    tanggalTutup?: boolean
    linkDriveTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    documentFields?: boolean | ProgramBantuan$documentFieldsArgs<ExtArgs>
    biodataFields?: boolean | ProgramBantuan$biodataFieldsArgs<ExtArgs>
    submissions?: boolean | ProgramBantuan$submissionsArgs<ExtArgs>
    _count?: boolean | ProgramBantuanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programBantuan"]>

  export type ProgramBantuanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nama?: boolean
    slug?: boolean
    deskripsi?: boolean
    gambarUrl?: boolean
    status?: boolean
    tanggalBuka?: boolean
    tanggalTutup?: boolean
    linkDriveTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["programBantuan"]>

  export type ProgramBantuanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nama?: boolean
    slug?: boolean
    deskripsi?: boolean
    gambarUrl?: boolean
    status?: boolean
    tanggalBuka?: boolean
    tanggalTutup?: boolean
    linkDriveTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["programBantuan"]>

  export type ProgramBantuanSelectScalar = {
    id?: boolean
    nama?: boolean
    slug?: boolean
    deskripsi?: boolean
    gambarUrl?: boolean
    status?: boolean
    tanggalBuka?: boolean
    tanggalTutup?: boolean
    linkDriveTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProgramBantuanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nama" | "slug" | "deskripsi" | "gambarUrl" | "status" | "tanggalBuka" | "tanggalTutup" | "linkDriveTemplate" | "createdAt" | "updatedAt", ExtArgs["result"]["programBantuan"]>
  export type ProgramBantuanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documentFields?: boolean | ProgramBantuan$documentFieldsArgs<ExtArgs>
    biodataFields?: boolean | ProgramBantuan$biodataFieldsArgs<ExtArgs>
    submissions?: boolean | ProgramBantuan$submissionsArgs<ExtArgs>
    _count?: boolean | ProgramBantuanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProgramBantuanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProgramBantuanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProgramBantuanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProgramBantuan"
    objects: {
      documentFields: Prisma.$DocumentFieldPayload<ExtArgs>[]
      biodataFields: Prisma.$BiodataFieldPayload<ExtArgs>[]
      submissions: Prisma.$SubmissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nama: string
      slug: string
      deskripsi: string | null
      gambarUrl: string | null
      status: string
      tanggalBuka: Date | null
      tanggalTutup: Date | null
      linkDriveTemplate: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["programBantuan"]>
    composites: {}
  }

  type ProgramBantuanGetPayload<S extends boolean | null | undefined | ProgramBantuanDefaultArgs> = $Result.GetResult<Prisma.$ProgramBantuanPayload, S>

  type ProgramBantuanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProgramBantuanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProgramBantuanCountAggregateInputType | true
    }

  export interface ProgramBantuanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProgramBantuan'], meta: { name: 'ProgramBantuan' } }
    /**
     * Find zero or one ProgramBantuan that matches the filter.
     * @param {ProgramBantuanFindUniqueArgs} args - Arguments to find a ProgramBantuan
     * @example
     * // Get one ProgramBantuan
     * const programBantuan = await prisma.programBantuan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgramBantuanFindUniqueArgs>(args: SelectSubset<T, ProgramBantuanFindUniqueArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProgramBantuan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProgramBantuanFindUniqueOrThrowArgs} args - Arguments to find a ProgramBantuan
     * @example
     * // Get one ProgramBantuan
     * const programBantuan = await prisma.programBantuan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgramBantuanFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgramBantuanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProgramBantuan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramBantuanFindFirstArgs} args - Arguments to find a ProgramBantuan
     * @example
     * // Get one ProgramBantuan
     * const programBantuan = await prisma.programBantuan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgramBantuanFindFirstArgs>(args?: SelectSubset<T, ProgramBantuanFindFirstArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProgramBantuan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramBantuanFindFirstOrThrowArgs} args - Arguments to find a ProgramBantuan
     * @example
     * // Get one ProgramBantuan
     * const programBantuan = await prisma.programBantuan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgramBantuanFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgramBantuanFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProgramBantuans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramBantuanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProgramBantuans
     * const programBantuans = await prisma.programBantuan.findMany()
     * 
     * // Get first 10 ProgramBantuans
     * const programBantuans = await prisma.programBantuan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const programBantuanWithIdOnly = await prisma.programBantuan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgramBantuanFindManyArgs>(args?: SelectSubset<T, ProgramBantuanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProgramBantuan.
     * @param {ProgramBantuanCreateArgs} args - Arguments to create a ProgramBantuan.
     * @example
     * // Create one ProgramBantuan
     * const ProgramBantuan = await prisma.programBantuan.create({
     *   data: {
     *     // ... data to create a ProgramBantuan
     *   }
     * })
     * 
     */
    create<T extends ProgramBantuanCreateArgs>(args: SelectSubset<T, ProgramBantuanCreateArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProgramBantuans.
     * @param {ProgramBantuanCreateManyArgs} args - Arguments to create many ProgramBantuans.
     * @example
     * // Create many ProgramBantuans
     * const programBantuan = await prisma.programBantuan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgramBantuanCreateManyArgs>(args?: SelectSubset<T, ProgramBantuanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProgramBantuans and returns the data saved in the database.
     * @param {ProgramBantuanCreateManyAndReturnArgs} args - Arguments to create many ProgramBantuans.
     * @example
     * // Create many ProgramBantuans
     * const programBantuan = await prisma.programBantuan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProgramBantuans and only return the `id`
     * const programBantuanWithIdOnly = await prisma.programBantuan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgramBantuanCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgramBantuanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProgramBantuan.
     * @param {ProgramBantuanDeleteArgs} args - Arguments to delete one ProgramBantuan.
     * @example
     * // Delete one ProgramBantuan
     * const ProgramBantuan = await prisma.programBantuan.delete({
     *   where: {
     *     // ... filter to delete one ProgramBantuan
     *   }
     * })
     * 
     */
    delete<T extends ProgramBantuanDeleteArgs>(args: SelectSubset<T, ProgramBantuanDeleteArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProgramBantuan.
     * @param {ProgramBantuanUpdateArgs} args - Arguments to update one ProgramBantuan.
     * @example
     * // Update one ProgramBantuan
     * const programBantuan = await prisma.programBantuan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgramBantuanUpdateArgs>(args: SelectSubset<T, ProgramBantuanUpdateArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProgramBantuans.
     * @param {ProgramBantuanDeleteManyArgs} args - Arguments to filter ProgramBantuans to delete.
     * @example
     * // Delete a few ProgramBantuans
     * const { count } = await prisma.programBantuan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgramBantuanDeleteManyArgs>(args?: SelectSubset<T, ProgramBantuanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProgramBantuans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramBantuanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProgramBantuans
     * const programBantuan = await prisma.programBantuan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgramBantuanUpdateManyArgs>(args: SelectSubset<T, ProgramBantuanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProgramBantuans and returns the data updated in the database.
     * @param {ProgramBantuanUpdateManyAndReturnArgs} args - Arguments to update many ProgramBantuans.
     * @example
     * // Update many ProgramBantuans
     * const programBantuan = await prisma.programBantuan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProgramBantuans and only return the `id`
     * const programBantuanWithIdOnly = await prisma.programBantuan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProgramBantuanUpdateManyAndReturnArgs>(args: SelectSubset<T, ProgramBantuanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProgramBantuan.
     * @param {ProgramBantuanUpsertArgs} args - Arguments to update or create a ProgramBantuan.
     * @example
     * // Update or create a ProgramBantuan
     * const programBantuan = await prisma.programBantuan.upsert({
     *   create: {
     *     // ... data to create a ProgramBantuan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProgramBantuan we want to update
     *   }
     * })
     */
    upsert<T extends ProgramBantuanUpsertArgs>(args: SelectSubset<T, ProgramBantuanUpsertArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProgramBantuans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramBantuanCountArgs} args - Arguments to filter ProgramBantuans to count.
     * @example
     * // Count the number of ProgramBantuans
     * const count = await prisma.programBantuan.count({
     *   where: {
     *     // ... the filter for the ProgramBantuans we want to count
     *   }
     * })
    **/
    count<T extends ProgramBantuanCountArgs>(
      args?: Subset<T, ProgramBantuanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgramBantuanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProgramBantuan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramBantuanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProgramBantuanAggregateArgs>(args: Subset<T, ProgramBantuanAggregateArgs>): Prisma.PrismaPromise<GetProgramBantuanAggregateType<T>>

    /**
     * Group by ProgramBantuan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramBantuanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProgramBantuanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgramBantuanGroupByArgs['orderBy'] }
        : { orderBy?: ProgramBantuanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProgramBantuanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgramBantuanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProgramBantuan model
   */
  readonly fields: ProgramBantuanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProgramBantuan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgramBantuanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    documentFields<T extends ProgramBantuan$documentFieldsArgs<ExtArgs> = {}>(args?: Subset<T, ProgramBantuan$documentFieldsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    biodataFields<T extends ProgramBantuan$biodataFieldsArgs<ExtArgs> = {}>(args?: Subset<T, ProgramBantuan$biodataFieldsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    submissions<T extends ProgramBantuan$submissionsArgs<ExtArgs> = {}>(args?: Subset<T, ProgramBantuan$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProgramBantuan model
   */
  interface ProgramBantuanFieldRefs {
    readonly id: FieldRef<"ProgramBantuan", 'String'>
    readonly nama: FieldRef<"ProgramBantuan", 'String'>
    readonly slug: FieldRef<"ProgramBantuan", 'String'>
    readonly deskripsi: FieldRef<"ProgramBantuan", 'String'>
    readonly gambarUrl: FieldRef<"ProgramBantuan", 'String'>
    readonly status: FieldRef<"ProgramBantuan", 'String'>
    readonly tanggalBuka: FieldRef<"ProgramBantuan", 'DateTime'>
    readonly tanggalTutup: FieldRef<"ProgramBantuan", 'DateTime'>
    readonly linkDriveTemplate: FieldRef<"ProgramBantuan", 'String'>
    readonly createdAt: FieldRef<"ProgramBantuan", 'DateTime'>
    readonly updatedAt: FieldRef<"ProgramBantuan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProgramBantuan findUnique
   */
  export type ProgramBantuanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramBantuanInclude<ExtArgs> | null
    /**
     * Filter, which ProgramBantuan to fetch.
     */
    where: ProgramBantuanWhereUniqueInput
  }

  /**
   * ProgramBantuan findUniqueOrThrow
   */
  export type ProgramBantuanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramBantuanInclude<ExtArgs> | null
    /**
     * Filter, which ProgramBantuan to fetch.
     */
    where: ProgramBantuanWhereUniqueInput
  }

  /**
   * ProgramBantuan findFirst
   */
  export type ProgramBantuanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramBantuanInclude<ExtArgs> | null
    /**
     * Filter, which ProgramBantuan to fetch.
     */
    where?: ProgramBantuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramBantuans to fetch.
     */
    orderBy?: ProgramBantuanOrderByWithRelationInput | ProgramBantuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProgramBantuans.
     */
    cursor?: ProgramBantuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramBantuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramBantuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgramBantuans.
     */
    distinct?: ProgramBantuanScalarFieldEnum | ProgramBantuanScalarFieldEnum[]
  }

  /**
   * ProgramBantuan findFirstOrThrow
   */
  export type ProgramBantuanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramBantuanInclude<ExtArgs> | null
    /**
     * Filter, which ProgramBantuan to fetch.
     */
    where?: ProgramBantuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramBantuans to fetch.
     */
    orderBy?: ProgramBantuanOrderByWithRelationInput | ProgramBantuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProgramBantuans.
     */
    cursor?: ProgramBantuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramBantuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramBantuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgramBantuans.
     */
    distinct?: ProgramBantuanScalarFieldEnum | ProgramBantuanScalarFieldEnum[]
  }

  /**
   * ProgramBantuan findMany
   */
  export type ProgramBantuanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramBantuanInclude<ExtArgs> | null
    /**
     * Filter, which ProgramBantuans to fetch.
     */
    where?: ProgramBantuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramBantuans to fetch.
     */
    orderBy?: ProgramBantuanOrderByWithRelationInput | ProgramBantuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProgramBantuans.
     */
    cursor?: ProgramBantuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramBantuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramBantuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgramBantuans.
     */
    distinct?: ProgramBantuanScalarFieldEnum | ProgramBantuanScalarFieldEnum[]
  }

  /**
   * ProgramBantuan create
   */
  export type ProgramBantuanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramBantuanInclude<ExtArgs> | null
    /**
     * The data needed to create a ProgramBantuan.
     */
    data: XOR<ProgramBantuanCreateInput, ProgramBantuanUncheckedCreateInput>
  }

  /**
   * ProgramBantuan createMany
   */
  export type ProgramBantuanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProgramBantuans.
     */
    data: ProgramBantuanCreateManyInput | ProgramBantuanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProgramBantuan createManyAndReturn
   */
  export type ProgramBantuanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * The data used to create many ProgramBantuans.
     */
    data: ProgramBantuanCreateManyInput | ProgramBantuanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProgramBantuan update
   */
  export type ProgramBantuanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramBantuanInclude<ExtArgs> | null
    /**
     * The data needed to update a ProgramBantuan.
     */
    data: XOR<ProgramBantuanUpdateInput, ProgramBantuanUncheckedUpdateInput>
    /**
     * Choose, which ProgramBantuan to update.
     */
    where: ProgramBantuanWhereUniqueInput
  }

  /**
   * ProgramBantuan updateMany
   */
  export type ProgramBantuanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProgramBantuans.
     */
    data: XOR<ProgramBantuanUpdateManyMutationInput, ProgramBantuanUncheckedUpdateManyInput>
    /**
     * Filter which ProgramBantuans to update
     */
    where?: ProgramBantuanWhereInput
    /**
     * Limit how many ProgramBantuans to update.
     */
    limit?: number
  }

  /**
   * ProgramBantuan updateManyAndReturn
   */
  export type ProgramBantuanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * The data used to update ProgramBantuans.
     */
    data: XOR<ProgramBantuanUpdateManyMutationInput, ProgramBantuanUncheckedUpdateManyInput>
    /**
     * Filter which ProgramBantuans to update
     */
    where?: ProgramBantuanWhereInput
    /**
     * Limit how many ProgramBantuans to update.
     */
    limit?: number
  }

  /**
   * ProgramBantuan upsert
   */
  export type ProgramBantuanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramBantuanInclude<ExtArgs> | null
    /**
     * The filter to search for the ProgramBantuan to update in case it exists.
     */
    where: ProgramBantuanWhereUniqueInput
    /**
     * In case the ProgramBantuan found by the `where` argument doesn't exist, create a new ProgramBantuan with this data.
     */
    create: XOR<ProgramBantuanCreateInput, ProgramBantuanUncheckedCreateInput>
    /**
     * In case the ProgramBantuan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgramBantuanUpdateInput, ProgramBantuanUncheckedUpdateInput>
  }

  /**
   * ProgramBantuan delete
   */
  export type ProgramBantuanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramBantuanInclude<ExtArgs> | null
    /**
     * Filter which ProgramBantuan to delete.
     */
    where: ProgramBantuanWhereUniqueInput
  }

  /**
   * ProgramBantuan deleteMany
   */
  export type ProgramBantuanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProgramBantuans to delete
     */
    where?: ProgramBantuanWhereInput
    /**
     * Limit how many ProgramBantuans to delete.
     */
    limit?: number
  }

  /**
   * ProgramBantuan.documentFields
   */
  export type ProgramBantuan$documentFieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    where?: DocumentFieldWhereInput
    orderBy?: DocumentFieldOrderByWithRelationInput | DocumentFieldOrderByWithRelationInput[]
    cursor?: DocumentFieldWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentFieldScalarFieldEnum | DocumentFieldScalarFieldEnum[]
  }

  /**
   * ProgramBantuan.biodataFields
   */
  export type ProgramBantuan$biodataFieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
    where?: BiodataFieldWhereInput
    orderBy?: BiodataFieldOrderByWithRelationInput | BiodataFieldOrderByWithRelationInput[]
    cursor?: BiodataFieldWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BiodataFieldScalarFieldEnum | BiodataFieldScalarFieldEnum[]
  }

  /**
   * ProgramBantuan.submissions
   */
  export type ProgramBantuan$submissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    where?: SubmissionWhereInput
    orderBy?: SubmissionOrderByWithRelationInput | SubmissionOrderByWithRelationInput[]
    cursor?: SubmissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * ProgramBantuan without action
   */
  export type ProgramBantuanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramBantuan
     */
    select?: ProgramBantuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramBantuan
     */
    omit?: ProgramBantuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramBantuanInclude<ExtArgs> | null
  }


  /**
   * Model DocumentField
   */

  export type AggregateDocumentField = {
    _count: DocumentFieldCountAggregateOutputType | null
    _avg: DocumentFieldAvgAggregateOutputType | null
    _sum: DocumentFieldSumAggregateOutputType | null
    _min: DocumentFieldMinAggregateOutputType | null
    _max: DocumentFieldMaxAggregateOutputType | null
  }

  export type DocumentFieldAvgAggregateOutputType = {
    maxAgeMonths: number | null
    order: number | null
  }

  export type DocumentFieldSumAggregateOutputType = {
    maxAgeMonths: number | null
    order: number | null
  }

  export type DocumentFieldMinAggregateOutputType = {
    id: string | null
    programId: string | null
    key: string | null
    label: string | null
    required: boolean | null
    maxAgeMonths: number | null
    nameCheckApplicable: boolean | null
    isSingleCombinedUpload: boolean | null
    needsStampCheck: boolean | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentFieldMaxAggregateOutputType = {
    id: string | null
    programId: string | null
    key: string | null
    label: string | null
    required: boolean | null
    maxAgeMonths: number | null
    nameCheckApplicable: boolean | null
    isSingleCombinedUpload: boolean | null
    needsStampCheck: boolean | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentFieldCountAggregateOutputType = {
    id: number
    programId: number
    key: number
    label: number
    required: number
    maxAgeMonths: number
    expectedKeywords: number
    nameCheckApplicable: number
    isSingleCombinedUpload: number
    needsStampCheck: number
    order: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentFieldAvgAggregateInputType = {
    maxAgeMonths?: true
    order?: true
  }

  export type DocumentFieldSumAggregateInputType = {
    maxAgeMonths?: true
    order?: true
  }

  export type DocumentFieldMinAggregateInputType = {
    id?: true
    programId?: true
    key?: true
    label?: true
    required?: true
    maxAgeMonths?: true
    nameCheckApplicable?: true
    isSingleCombinedUpload?: true
    needsStampCheck?: true
    order?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentFieldMaxAggregateInputType = {
    id?: true
    programId?: true
    key?: true
    label?: true
    required?: true
    maxAgeMonths?: true
    nameCheckApplicable?: true
    isSingleCombinedUpload?: true
    needsStampCheck?: true
    order?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentFieldCountAggregateInputType = {
    id?: true
    programId?: true
    key?: true
    label?: true
    required?: true
    maxAgeMonths?: true
    expectedKeywords?: true
    nameCheckApplicable?: true
    isSingleCombinedUpload?: true
    needsStampCheck?: true
    order?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentFieldAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocumentField to aggregate.
     */
    where?: DocumentFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentFields to fetch.
     */
    orderBy?: DocumentFieldOrderByWithRelationInput | DocumentFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DocumentFields
    **/
    _count?: true | DocumentFieldCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentFieldAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentFieldSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentFieldMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentFieldMaxAggregateInputType
  }

  export type GetDocumentFieldAggregateType<T extends DocumentFieldAggregateArgs> = {
        [P in keyof T & keyof AggregateDocumentField]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocumentField[P]>
      : GetScalarType<T[P], AggregateDocumentField[P]>
  }




  export type DocumentFieldGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentFieldWhereInput
    orderBy?: DocumentFieldOrderByWithAggregationInput | DocumentFieldOrderByWithAggregationInput[]
    by: DocumentFieldScalarFieldEnum[] | DocumentFieldScalarFieldEnum
    having?: DocumentFieldScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentFieldCountAggregateInputType | true
    _avg?: DocumentFieldAvgAggregateInputType
    _sum?: DocumentFieldSumAggregateInputType
    _min?: DocumentFieldMinAggregateInputType
    _max?: DocumentFieldMaxAggregateInputType
  }

  export type DocumentFieldGroupByOutputType = {
    id: string
    programId: string
    key: string
    label: string
    required: boolean
    maxAgeMonths: number | null
    expectedKeywords: string[]
    nameCheckApplicable: boolean
    isSingleCombinedUpload: boolean
    needsStampCheck: boolean
    order: number
    createdAt: Date
    updatedAt: Date
    _count: DocumentFieldCountAggregateOutputType | null
    _avg: DocumentFieldAvgAggregateOutputType | null
    _sum: DocumentFieldSumAggregateOutputType | null
    _min: DocumentFieldMinAggregateOutputType | null
    _max: DocumentFieldMaxAggregateOutputType | null
  }

  type GetDocumentFieldGroupByPayload<T extends DocumentFieldGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentFieldGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentFieldGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentFieldGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentFieldGroupByOutputType[P]>
        }
      >
    >


  export type DocumentFieldSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    programId?: boolean
    key?: boolean
    label?: boolean
    required?: boolean
    maxAgeMonths?: boolean
    expectedKeywords?: boolean
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
    documents?: boolean | DocumentField$documentsArgs<ExtArgs>
    _count?: boolean | DocumentFieldCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["documentField"]>

  export type DocumentFieldSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    programId?: boolean
    key?: boolean
    label?: boolean
    required?: boolean
    maxAgeMonths?: boolean
    expectedKeywords?: boolean
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["documentField"]>

  export type DocumentFieldSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    programId?: boolean
    key?: boolean
    label?: boolean
    required?: boolean
    maxAgeMonths?: boolean
    expectedKeywords?: boolean
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["documentField"]>

  export type DocumentFieldSelectScalar = {
    id?: boolean
    programId?: boolean
    key?: boolean
    label?: boolean
    required?: boolean
    maxAgeMonths?: boolean
    expectedKeywords?: boolean
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentFieldOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "programId" | "key" | "label" | "required" | "maxAgeMonths" | "expectedKeywords" | "nameCheckApplicable" | "isSingleCombinedUpload" | "needsStampCheck" | "order" | "createdAt" | "updatedAt", ExtArgs["result"]["documentField"]>
  export type DocumentFieldInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
    documents?: boolean | DocumentField$documentsArgs<ExtArgs>
    _count?: boolean | DocumentFieldCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DocumentFieldIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }
  export type DocumentFieldIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }

  export type $DocumentFieldPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DocumentField"
    objects: {
      program: Prisma.$ProgramBantuanPayload<ExtArgs>
      documents: Prisma.$SubmissionDocumentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      programId: string
      key: string
      label: string
      required: boolean
      maxAgeMonths: number | null
      expectedKeywords: string[]
      nameCheckApplicable: boolean
      isSingleCombinedUpload: boolean
      needsStampCheck: boolean
      order: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["documentField"]>
    composites: {}
  }

  type DocumentFieldGetPayload<S extends boolean | null | undefined | DocumentFieldDefaultArgs> = $Result.GetResult<Prisma.$DocumentFieldPayload, S>

  type DocumentFieldCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFieldFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentFieldCountAggregateInputType | true
    }

  export interface DocumentFieldDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DocumentField'], meta: { name: 'DocumentField' } }
    /**
     * Find zero or one DocumentField that matches the filter.
     * @param {DocumentFieldFindUniqueArgs} args - Arguments to find a DocumentField
     * @example
     * // Get one DocumentField
     * const documentField = await prisma.documentField.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFieldFindUniqueArgs>(args: SelectSubset<T, DocumentFieldFindUniqueArgs<ExtArgs>>): Prisma__DocumentFieldClient<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DocumentField that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFieldFindUniqueOrThrowArgs} args - Arguments to find a DocumentField
     * @example
     * // Get one DocumentField
     * const documentField = await prisma.documentField.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFieldFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFieldFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentFieldClient<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DocumentField that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFieldFindFirstArgs} args - Arguments to find a DocumentField
     * @example
     * // Get one DocumentField
     * const documentField = await prisma.documentField.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFieldFindFirstArgs>(args?: SelectSubset<T, DocumentFieldFindFirstArgs<ExtArgs>>): Prisma__DocumentFieldClient<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DocumentField that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFieldFindFirstOrThrowArgs} args - Arguments to find a DocumentField
     * @example
     * // Get one DocumentField
     * const documentField = await prisma.documentField.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFieldFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFieldFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentFieldClient<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DocumentFields that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFieldFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DocumentFields
     * const documentFields = await prisma.documentField.findMany()
     * 
     * // Get first 10 DocumentFields
     * const documentFields = await prisma.documentField.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentFieldWithIdOnly = await prisma.documentField.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFieldFindManyArgs>(args?: SelectSubset<T, DocumentFieldFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DocumentField.
     * @param {DocumentFieldCreateArgs} args - Arguments to create a DocumentField.
     * @example
     * // Create one DocumentField
     * const DocumentField = await prisma.documentField.create({
     *   data: {
     *     // ... data to create a DocumentField
     *   }
     * })
     * 
     */
    create<T extends DocumentFieldCreateArgs>(args: SelectSubset<T, DocumentFieldCreateArgs<ExtArgs>>): Prisma__DocumentFieldClient<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DocumentFields.
     * @param {DocumentFieldCreateManyArgs} args - Arguments to create many DocumentFields.
     * @example
     * // Create many DocumentFields
     * const documentField = await prisma.documentField.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentFieldCreateManyArgs>(args?: SelectSubset<T, DocumentFieldCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DocumentFields and returns the data saved in the database.
     * @param {DocumentFieldCreateManyAndReturnArgs} args - Arguments to create many DocumentFields.
     * @example
     * // Create many DocumentFields
     * const documentField = await prisma.documentField.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DocumentFields and only return the `id`
     * const documentFieldWithIdOnly = await prisma.documentField.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentFieldCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentFieldCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DocumentField.
     * @param {DocumentFieldDeleteArgs} args - Arguments to delete one DocumentField.
     * @example
     * // Delete one DocumentField
     * const DocumentField = await prisma.documentField.delete({
     *   where: {
     *     // ... filter to delete one DocumentField
     *   }
     * })
     * 
     */
    delete<T extends DocumentFieldDeleteArgs>(args: SelectSubset<T, DocumentFieldDeleteArgs<ExtArgs>>): Prisma__DocumentFieldClient<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DocumentField.
     * @param {DocumentFieldUpdateArgs} args - Arguments to update one DocumentField.
     * @example
     * // Update one DocumentField
     * const documentField = await prisma.documentField.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentFieldUpdateArgs>(args: SelectSubset<T, DocumentFieldUpdateArgs<ExtArgs>>): Prisma__DocumentFieldClient<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DocumentFields.
     * @param {DocumentFieldDeleteManyArgs} args - Arguments to filter DocumentFields to delete.
     * @example
     * // Delete a few DocumentFields
     * const { count } = await prisma.documentField.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentFieldDeleteManyArgs>(args?: SelectSubset<T, DocumentFieldDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DocumentFields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFieldUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DocumentFields
     * const documentField = await prisma.documentField.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentFieldUpdateManyArgs>(args: SelectSubset<T, DocumentFieldUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DocumentFields and returns the data updated in the database.
     * @param {DocumentFieldUpdateManyAndReturnArgs} args - Arguments to update many DocumentFields.
     * @example
     * // Update many DocumentFields
     * const documentField = await prisma.documentField.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DocumentFields and only return the `id`
     * const documentFieldWithIdOnly = await prisma.documentField.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentFieldUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentFieldUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DocumentField.
     * @param {DocumentFieldUpsertArgs} args - Arguments to update or create a DocumentField.
     * @example
     * // Update or create a DocumentField
     * const documentField = await prisma.documentField.upsert({
     *   create: {
     *     // ... data to create a DocumentField
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DocumentField we want to update
     *   }
     * })
     */
    upsert<T extends DocumentFieldUpsertArgs>(args: SelectSubset<T, DocumentFieldUpsertArgs<ExtArgs>>): Prisma__DocumentFieldClient<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DocumentFields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFieldCountArgs} args - Arguments to filter DocumentFields to count.
     * @example
     * // Count the number of DocumentFields
     * const count = await prisma.documentField.count({
     *   where: {
     *     // ... the filter for the DocumentFields we want to count
     *   }
     * })
    **/
    count<T extends DocumentFieldCountArgs>(
      args?: Subset<T, DocumentFieldCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentFieldCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DocumentField.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFieldAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentFieldAggregateArgs>(args: Subset<T, DocumentFieldAggregateArgs>): Prisma.PrismaPromise<GetDocumentFieldAggregateType<T>>

    /**
     * Group by DocumentField.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFieldGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentFieldGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentFieldGroupByArgs['orderBy'] }
        : { orderBy?: DocumentFieldGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentFieldGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentFieldGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DocumentField model
   */
  readonly fields: DocumentFieldFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DocumentField.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentFieldClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    program<T extends ProgramBantuanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgramBantuanDefaultArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    documents<T extends DocumentField$documentsArgs<ExtArgs> = {}>(args?: Subset<T, DocumentField$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DocumentField model
   */
  interface DocumentFieldFieldRefs {
    readonly id: FieldRef<"DocumentField", 'String'>
    readonly programId: FieldRef<"DocumentField", 'String'>
    readonly key: FieldRef<"DocumentField", 'String'>
    readonly label: FieldRef<"DocumentField", 'String'>
    readonly required: FieldRef<"DocumentField", 'Boolean'>
    readonly maxAgeMonths: FieldRef<"DocumentField", 'Int'>
    readonly expectedKeywords: FieldRef<"DocumentField", 'String[]'>
    readonly nameCheckApplicable: FieldRef<"DocumentField", 'Boolean'>
    readonly isSingleCombinedUpload: FieldRef<"DocumentField", 'Boolean'>
    readonly needsStampCheck: FieldRef<"DocumentField", 'Boolean'>
    readonly order: FieldRef<"DocumentField", 'Int'>
    readonly createdAt: FieldRef<"DocumentField", 'DateTime'>
    readonly updatedAt: FieldRef<"DocumentField", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DocumentField findUnique
   */
  export type DocumentFieldFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    /**
     * Filter, which DocumentField to fetch.
     */
    where: DocumentFieldWhereUniqueInput
  }

  /**
   * DocumentField findUniqueOrThrow
   */
  export type DocumentFieldFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    /**
     * Filter, which DocumentField to fetch.
     */
    where: DocumentFieldWhereUniqueInput
  }

  /**
   * DocumentField findFirst
   */
  export type DocumentFieldFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    /**
     * Filter, which DocumentField to fetch.
     */
    where?: DocumentFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentFields to fetch.
     */
    orderBy?: DocumentFieldOrderByWithRelationInput | DocumentFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocumentFields.
     */
    cursor?: DocumentFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentFields.
     */
    distinct?: DocumentFieldScalarFieldEnum | DocumentFieldScalarFieldEnum[]
  }

  /**
   * DocumentField findFirstOrThrow
   */
  export type DocumentFieldFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    /**
     * Filter, which DocumentField to fetch.
     */
    where?: DocumentFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentFields to fetch.
     */
    orderBy?: DocumentFieldOrderByWithRelationInput | DocumentFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocumentFields.
     */
    cursor?: DocumentFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentFields.
     */
    distinct?: DocumentFieldScalarFieldEnum | DocumentFieldScalarFieldEnum[]
  }

  /**
   * DocumentField findMany
   */
  export type DocumentFieldFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    /**
     * Filter, which DocumentFields to fetch.
     */
    where?: DocumentFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentFields to fetch.
     */
    orderBy?: DocumentFieldOrderByWithRelationInput | DocumentFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DocumentFields.
     */
    cursor?: DocumentFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentFields.
     */
    distinct?: DocumentFieldScalarFieldEnum | DocumentFieldScalarFieldEnum[]
  }

  /**
   * DocumentField create
   */
  export type DocumentFieldCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    /**
     * The data needed to create a DocumentField.
     */
    data: XOR<DocumentFieldCreateInput, DocumentFieldUncheckedCreateInput>
  }

  /**
   * DocumentField createMany
   */
  export type DocumentFieldCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DocumentFields.
     */
    data: DocumentFieldCreateManyInput | DocumentFieldCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DocumentField createManyAndReturn
   */
  export type DocumentFieldCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * The data used to create many DocumentFields.
     */
    data: DocumentFieldCreateManyInput | DocumentFieldCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DocumentField update
   */
  export type DocumentFieldUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    /**
     * The data needed to update a DocumentField.
     */
    data: XOR<DocumentFieldUpdateInput, DocumentFieldUncheckedUpdateInput>
    /**
     * Choose, which DocumentField to update.
     */
    where: DocumentFieldWhereUniqueInput
  }

  /**
   * DocumentField updateMany
   */
  export type DocumentFieldUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DocumentFields.
     */
    data: XOR<DocumentFieldUpdateManyMutationInput, DocumentFieldUncheckedUpdateManyInput>
    /**
     * Filter which DocumentFields to update
     */
    where?: DocumentFieldWhereInput
    /**
     * Limit how many DocumentFields to update.
     */
    limit?: number
  }

  /**
   * DocumentField updateManyAndReturn
   */
  export type DocumentFieldUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * The data used to update DocumentFields.
     */
    data: XOR<DocumentFieldUpdateManyMutationInput, DocumentFieldUncheckedUpdateManyInput>
    /**
     * Filter which DocumentFields to update
     */
    where?: DocumentFieldWhereInput
    /**
     * Limit how many DocumentFields to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DocumentField upsert
   */
  export type DocumentFieldUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    /**
     * The filter to search for the DocumentField to update in case it exists.
     */
    where: DocumentFieldWhereUniqueInput
    /**
     * In case the DocumentField found by the `where` argument doesn't exist, create a new DocumentField with this data.
     */
    create: XOR<DocumentFieldCreateInput, DocumentFieldUncheckedCreateInput>
    /**
     * In case the DocumentField was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentFieldUpdateInput, DocumentFieldUncheckedUpdateInput>
  }

  /**
   * DocumentField delete
   */
  export type DocumentFieldDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    /**
     * Filter which DocumentField to delete.
     */
    where: DocumentFieldWhereUniqueInput
  }

  /**
   * DocumentField deleteMany
   */
  export type DocumentFieldDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocumentFields to delete
     */
    where?: DocumentFieldWhereInput
    /**
     * Limit how many DocumentFields to delete.
     */
    limit?: number
  }

  /**
   * DocumentField.documents
   */
  export type DocumentField$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    where?: SubmissionDocumentWhereInput
    orderBy?: SubmissionDocumentOrderByWithRelationInput | SubmissionDocumentOrderByWithRelationInput[]
    cursor?: SubmissionDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubmissionDocumentScalarFieldEnum | SubmissionDocumentScalarFieldEnum[]
  }

  /**
   * DocumentField without action
   */
  export type DocumentFieldDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
  }


  /**
   * Model BiodataField
   */

  export type AggregateBiodataField = {
    _count: BiodataFieldCountAggregateOutputType | null
    _avg: BiodataFieldAvgAggregateOutputType | null
    _sum: BiodataFieldSumAggregateOutputType | null
    _min: BiodataFieldMinAggregateOutputType | null
    _max: BiodataFieldMaxAggregateOutputType | null
  }

  export type BiodataFieldAvgAggregateOutputType = {
    order: number | null
  }

  export type BiodataFieldSumAggregateOutputType = {
    order: number | null
  }

  export type BiodataFieldMinAggregateOutputType = {
    id: string | null
    programId: string | null
    key: string | null
    label: string | null
    tipe: string | null
    required: boolean | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BiodataFieldMaxAggregateOutputType = {
    id: string | null
    programId: string | null
    key: string | null
    label: string | null
    tipe: string | null
    required: boolean | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BiodataFieldCountAggregateOutputType = {
    id: number
    programId: number
    key: number
    label: number
    tipe: number
    options: number
    required: number
    order: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BiodataFieldAvgAggregateInputType = {
    order?: true
  }

  export type BiodataFieldSumAggregateInputType = {
    order?: true
  }

  export type BiodataFieldMinAggregateInputType = {
    id?: true
    programId?: true
    key?: true
    label?: true
    tipe?: true
    required?: true
    order?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BiodataFieldMaxAggregateInputType = {
    id?: true
    programId?: true
    key?: true
    label?: true
    tipe?: true
    required?: true
    order?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BiodataFieldCountAggregateInputType = {
    id?: true
    programId?: true
    key?: true
    label?: true
    tipe?: true
    options?: true
    required?: true
    order?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BiodataFieldAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BiodataField to aggregate.
     */
    where?: BiodataFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BiodataFields to fetch.
     */
    orderBy?: BiodataFieldOrderByWithRelationInput | BiodataFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BiodataFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BiodataFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BiodataFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BiodataFields
    **/
    _count?: true | BiodataFieldCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BiodataFieldAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BiodataFieldSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BiodataFieldMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BiodataFieldMaxAggregateInputType
  }

  export type GetBiodataFieldAggregateType<T extends BiodataFieldAggregateArgs> = {
        [P in keyof T & keyof AggregateBiodataField]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBiodataField[P]>
      : GetScalarType<T[P], AggregateBiodataField[P]>
  }




  export type BiodataFieldGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BiodataFieldWhereInput
    orderBy?: BiodataFieldOrderByWithAggregationInput | BiodataFieldOrderByWithAggregationInput[]
    by: BiodataFieldScalarFieldEnum[] | BiodataFieldScalarFieldEnum
    having?: BiodataFieldScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BiodataFieldCountAggregateInputType | true
    _avg?: BiodataFieldAvgAggregateInputType
    _sum?: BiodataFieldSumAggregateInputType
    _min?: BiodataFieldMinAggregateInputType
    _max?: BiodataFieldMaxAggregateInputType
  }

  export type BiodataFieldGroupByOutputType = {
    id: string
    programId: string
    key: string
    label: string
    tipe: string
    options: string[]
    required: boolean
    order: number
    createdAt: Date
    updatedAt: Date
    _count: BiodataFieldCountAggregateOutputType | null
    _avg: BiodataFieldAvgAggregateOutputType | null
    _sum: BiodataFieldSumAggregateOutputType | null
    _min: BiodataFieldMinAggregateOutputType | null
    _max: BiodataFieldMaxAggregateOutputType | null
  }

  type GetBiodataFieldGroupByPayload<T extends BiodataFieldGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BiodataFieldGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BiodataFieldGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BiodataFieldGroupByOutputType[P]>
            : GetScalarType<T[P], BiodataFieldGroupByOutputType[P]>
        }
      >
    >


  export type BiodataFieldSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    programId?: boolean
    key?: boolean
    label?: boolean
    tipe?: boolean
    options?: boolean
    required?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["biodataField"]>

  export type BiodataFieldSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    programId?: boolean
    key?: boolean
    label?: boolean
    tipe?: boolean
    options?: boolean
    required?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["biodataField"]>

  export type BiodataFieldSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    programId?: boolean
    key?: boolean
    label?: boolean
    tipe?: boolean
    options?: boolean
    required?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["biodataField"]>

  export type BiodataFieldSelectScalar = {
    id?: boolean
    programId?: boolean
    key?: boolean
    label?: boolean
    tipe?: boolean
    options?: boolean
    required?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BiodataFieldOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "programId" | "key" | "label" | "tipe" | "options" | "required" | "order" | "createdAt" | "updatedAt", ExtArgs["result"]["biodataField"]>
  export type BiodataFieldInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }
  export type BiodataFieldIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }
  export type BiodataFieldIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }

  export type $BiodataFieldPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BiodataField"
    objects: {
      program: Prisma.$ProgramBantuanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      programId: string
      key: string
      label: string
      tipe: string
      options: string[]
      required: boolean
      order: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["biodataField"]>
    composites: {}
  }

  type BiodataFieldGetPayload<S extends boolean | null | undefined | BiodataFieldDefaultArgs> = $Result.GetResult<Prisma.$BiodataFieldPayload, S>

  type BiodataFieldCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BiodataFieldFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BiodataFieldCountAggregateInputType | true
    }

  export interface BiodataFieldDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BiodataField'], meta: { name: 'BiodataField' } }
    /**
     * Find zero or one BiodataField that matches the filter.
     * @param {BiodataFieldFindUniqueArgs} args - Arguments to find a BiodataField
     * @example
     * // Get one BiodataField
     * const biodataField = await prisma.biodataField.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BiodataFieldFindUniqueArgs>(args: SelectSubset<T, BiodataFieldFindUniqueArgs<ExtArgs>>): Prisma__BiodataFieldClient<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BiodataField that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BiodataFieldFindUniqueOrThrowArgs} args - Arguments to find a BiodataField
     * @example
     * // Get one BiodataField
     * const biodataField = await prisma.biodataField.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BiodataFieldFindUniqueOrThrowArgs>(args: SelectSubset<T, BiodataFieldFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BiodataFieldClient<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BiodataField that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BiodataFieldFindFirstArgs} args - Arguments to find a BiodataField
     * @example
     * // Get one BiodataField
     * const biodataField = await prisma.biodataField.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BiodataFieldFindFirstArgs>(args?: SelectSubset<T, BiodataFieldFindFirstArgs<ExtArgs>>): Prisma__BiodataFieldClient<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BiodataField that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BiodataFieldFindFirstOrThrowArgs} args - Arguments to find a BiodataField
     * @example
     * // Get one BiodataField
     * const biodataField = await prisma.biodataField.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BiodataFieldFindFirstOrThrowArgs>(args?: SelectSubset<T, BiodataFieldFindFirstOrThrowArgs<ExtArgs>>): Prisma__BiodataFieldClient<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BiodataFields that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BiodataFieldFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BiodataFields
     * const biodataFields = await prisma.biodataField.findMany()
     * 
     * // Get first 10 BiodataFields
     * const biodataFields = await prisma.biodataField.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const biodataFieldWithIdOnly = await prisma.biodataField.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BiodataFieldFindManyArgs>(args?: SelectSubset<T, BiodataFieldFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BiodataField.
     * @param {BiodataFieldCreateArgs} args - Arguments to create a BiodataField.
     * @example
     * // Create one BiodataField
     * const BiodataField = await prisma.biodataField.create({
     *   data: {
     *     // ... data to create a BiodataField
     *   }
     * })
     * 
     */
    create<T extends BiodataFieldCreateArgs>(args: SelectSubset<T, BiodataFieldCreateArgs<ExtArgs>>): Prisma__BiodataFieldClient<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BiodataFields.
     * @param {BiodataFieldCreateManyArgs} args - Arguments to create many BiodataFields.
     * @example
     * // Create many BiodataFields
     * const biodataField = await prisma.biodataField.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BiodataFieldCreateManyArgs>(args?: SelectSubset<T, BiodataFieldCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BiodataFields and returns the data saved in the database.
     * @param {BiodataFieldCreateManyAndReturnArgs} args - Arguments to create many BiodataFields.
     * @example
     * // Create many BiodataFields
     * const biodataField = await prisma.biodataField.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BiodataFields and only return the `id`
     * const biodataFieldWithIdOnly = await prisma.biodataField.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BiodataFieldCreateManyAndReturnArgs>(args?: SelectSubset<T, BiodataFieldCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BiodataField.
     * @param {BiodataFieldDeleteArgs} args - Arguments to delete one BiodataField.
     * @example
     * // Delete one BiodataField
     * const BiodataField = await prisma.biodataField.delete({
     *   where: {
     *     // ... filter to delete one BiodataField
     *   }
     * })
     * 
     */
    delete<T extends BiodataFieldDeleteArgs>(args: SelectSubset<T, BiodataFieldDeleteArgs<ExtArgs>>): Prisma__BiodataFieldClient<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BiodataField.
     * @param {BiodataFieldUpdateArgs} args - Arguments to update one BiodataField.
     * @example
     * // Update one BiodataField
     * const biodataField = await prisma.biodataField.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BiodataFieldUpdateArgs>(args: SelectSubset<T, BiodataFieldUpdateArgs<ExtArgs>>): Prisma__BiodataFieldClient<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BiodataFields.
     * @param {BiodataFieldDeleteManyArgs} args - Arguments to filter BiodataFields to delete.
     * @example
     * // Delete a few BiodataFields
     * const { count } = await prisma.biodataField.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BiodataFieldDeleteManyArgs>(args?: SelectSubset<T, BiodataFieldDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BiodataFields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BiodataFieldUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BiodataFields
     * const biodataField = await prisma.biodataField.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BiodataFieldUpdateManyArgs>(args: SelectSubset<T, BiodataFieldUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BiodataFields and returns the data updated in the database.
     * @param {BiodataFieldUpdateManyAndReturnArgs} args - Arguments to update many BiodataFields.
     * @example
     * // Update many BiodataFields
     * const biodataField = await prisma.biodataField.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BiodataFields and only return the `id`
     * const biodataFieldWithIdOnly = await prisma.biodataField.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BiodataFieldUpdateManyAndReturnArgs>(args: SelectSubset<T, BiodataFieldUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BiodataField.
     * @param {BiodataFieldUpsertArgs} args - Arguments to update or create a BiodataField.
     * @example
     * // Update or create a BiodataField
     * const biodataField = await prisma.biodataField.upsert({
     *   create: {
     *     // ... data to create a BiodataField
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BiodataField we want to update
     *   }
     * })
     */
    upsert<T extends BiodataFieldUpsertArgs>(args: SelectSubset<T, BiodataFieldUpsertArgs<ExtArgs>>): Prisma__BiodataFieldClient<$Result.GetResult<Prisma.$BiodataFieldPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BiodataFields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BiodataFieldCountArgs} args - Arguments to filter BiodataFields to count.
     * @example
     * // Count the number of BiodataFields
     * const count = await prisma.biodataField.count({
     *   where: {
     *     // ... the filter for the BiodataFields we want to count
     *   }
     * })
    **/
    count<T extends BiodataFieldCountArgs>(
      args?: Subset<T, BiodataFieldCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BiodataFieldCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BiodataField.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BiodataFieldAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BiodataFieldAggregateArgs>(args: Subset<T, BiodataFieldAggregateArgs>): Prisma.PrismaPromise<GetBiodataFieldAggregateType<T>>

    /**
     * Group by BiodataField.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BiodataFieldGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BiodataFieldGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BiodataFieldGroupByArgs['orderBy'] }
        : { orderBy?: BiodataFieldGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BiodataFieldGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBiodataFieldGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BiodataField model
   */
  readonly fields: BiodataFieldFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BiodataField.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BiodataFieldClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    program<T extends ProgramBantuanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgramBantuanDefaultArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BiodataField model
   */
  interface BiodataFieldFieldRefs {
    readonly id: FieldRef<"BiodataField", 'String'>
    readonly programId: FieldRef<"BiodataField", 'String'>
    readonly key: FieldRef<"BiodataField", 'String'>
    readonly label: FieldRef<"BiodataField", 'String'>
    readonly tipe: FieldRef<"BiodataField", 'String'>
    readonly options: FieldRef<"BiodataField", 'String[]'>
    readonly required: FieldRef<"BiodataField", 'Boolean'>
    readonly order: FieldRef<"BiodataField", 'Int'>
    readonly createdAt: FieldRef<"BiodataField", 'DateTime'>
    readonly updatedAt: FieldRef<"BiodataField", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BiodataField findUnique
   */
  export type BiodataFieldFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
    /**
     * Filter, which BiodataField to fetch.
     */
    where: BiodataFieldWhereUniqueInput
  }

  /**
   * BiodataField findUniqueOrThrow
   */
  export type BiodataFieldFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
    /**
     * Filter, which BiodataField to fetch.
     */
    where: BiodataFieldWhereUniqueInput
  }

  /**
   * BiodataField findFirst
   */
  export type BiodataFieldFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
    /**
     * Filter, which BiodataField to fetch.
     */
    where?: BiodataFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BiodataFields to fetch.
     */
    orderBy?: BiodataFieldOrderByWithRelationInput | BiodataFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BiodataFields.
     */
    cursor?: BiodataFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BiodataFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BiodataFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BiodataFields.
     */
    distinct?: BiodataFieldScalarFieldEnum | BiodataFieldScalarFieldEnum[]
  }

  /**
   * BiodataField findFirstOrThrow
   */
  export type BiodataFieldFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
    /**
     * Filter, which BiodataField to fetch.
     */
    where?: BiodataFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BiodataFields to fetch.
     */
    orderBy?: BiodataFieldOrderByWithRelationInput | BiodataFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BiodataFields.
     */
    cursor?: BiodataFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BiodataFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BiodataFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BiodataFields.
     */
    distinct?: BiodataFieldScalarFieldEnum | BiodataFieldScalarFieldEnum[]
  }

  /**
   * BiodataField findMany
   */
  export type BiodataFieldFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
    /**
     * Filter, which BiodataFields to fetch.
     */
    where?: BiodataFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BiodataFields to fetch.
     */
    orderBy?: BiodataFieldOrderByWithRelationInput | BiodataFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BiodataFields.
     */
    cursor?: BiodataFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BiodataFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BiodataFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BiodataFields.
     */
    distinct?: BiodataFieldScalarFieldEnum | BiodataFieldScalarFieldEnum[]
  }

  /**
   * BiodataField create
   */
  export type BiodataFieldCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
    /**
     * The data needed to create a BiodataField.
     */
    data: XOR<BiodataFieldCreateInput, BiodataFieldUncheckedCreateInput>
  }

  /**
   * BiodataField createMany
   */
  export type BiodataFieldCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BiodataFields.
     */
    data: BiodataFieldCreateManyInput | BiodataFieldCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BiodataField createManyAndReturn
   */
  export type BiodataFieldCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * The data used to create many BiodataFields.
     */
    data: BiodataFieldCreateManyInput | BiodataFieldCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BiodataField update
   */
  export type BiodataFieldUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
    /**
     * The data needed to update a BiodataField.
     */
    data: XOR<BiodataFieldUpdateInput, BiodataFieldUncheckedUpdateInput>
    /**
     * Choose, which BiodataField to update.
     */
    where: BiodataFieldWhereUniqueInput
  }

  /**
   * BiodataField updateMany
   */
  export type BiodataFieldUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BiodataFields.
     */
    data: XOR<BiodataFieldUpdateManyMutationInput, BiodataFieldUncheckedUpdateManyInput>
    /**
     * Filter which BiodataFields to update
     */
    where?: BiodataFieldWhereInput
    /**
     * Limit how many BiodataFields to update.
     */
    limit?: number
  }

  /**
   * BiodataField updateManyAndReturn
   */
  export type BiodataFieldUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * The data used to update BiodataFields.
     */
    data: XOR<BiodataFieldUpdateManyMutationInput, BiodataFieldUncheckedUpdateManyInput>
    /**
     * Filter which BiodataFields to update
     */
    where?: BiodataFieldWhereInput
    /**
     * Limit how many BiodataFields to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BiodataField upsert
   */
  export type BiodataFieldUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
    /**
     * The filter to search for the BiodataField to update in case it exists.
     */
    where: BiodataFieldWhereUniqueInput
    /**
     * In case the BiodataField found by the `where` argument doesn't exist, create a new BiodataField with this data.
     */
    create: XOR<BiodataFieldCreateInput, BiodataFieldUncheckedCreateInput>
    /**
     * In case the BiodataField was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BiodataFieldUpdateInput, BiodataFieldUncheckedUpdateInput>
  }

  /**
   * BiodataField delete
   */
  export type BiodataFieldDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
    /**
     * Filter which BiodataField to delete.
     */
    where: BiodataFieldWhereUniqueInput
  }

  /**
   * BiodataField deleteMany
   */
  export type BiodataFieldDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BiodataFields to delete
     */
    where?: BiodataFieldWhereInput
    /**
     * Limit how many BiodataFields to delete.
     */
    limit?: number
  }

  /**
   * BiodataField without action
   */
  export type BiodataFieldDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BiodataField
     */
    select?: BiodataFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BiodataField
     */
    omit?: BiodataFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BiodataFieldInclude<ExtArgs> | null
  }


  /**
   * Model Submission
   */

  export type AggregateSubmission = {
    _count: SubmissionCountAggregateOutputType | null
    _min: SubmissionMinAggregateOutputType | null
    _max: SubmissionMaxAggregateOutputType | null
  }

  export type SubmissionMinAggregateOutputType = {
    id: string | null
    programId: string | null
    token: string | null
    status: string | null
    linkDokumenGabungan: string | null
    processingStartedAt: Date | null
    submittedAt: Date | null
    updatedAt: Date | null
  }

  export type SubmissionMaxAggregateOutputType = {
    id: string | null
    programId: string | null
    token: string | null
    status: string | null
    linkDokumenGabungan: string | null
    processingStartedAt: Date | null
    submittedAt: Date | null
    updatedAt: Date | null
  }

  export type SubmissionCountAggregateOutputType = {
    id: number
    programId: number
    token: number
    biodataValues: number
    status: number
    warnings: number
    linkDokumenGabungan: number
    processingStartedAt: number
    submittedAt: number
    updatedAt: number
    _all: number
  }


  export type SubmissionMinAggregateInputType = {
    id?: true
    programId?: true
    token?: true
    status?: true
    linkDokumenGabungan?: true
    processingStartedAt?: true
    submittedAt?: true
    updatedAt?: true
  }

  export type SubmissionMaxAggregateInputType = {
    id?: true
    programId?: true
    token?: true
    status?: true
    linkDokumenGabungan?: true
    processingStartedAt?: true
    submittedAt?: true
    updatedAt?: true
  }

  export type SubmissionCountAggregateInputType = {
    id?: true
    programId?: true
    token?: true
    biodataValues?: true
    status?: true
    warnings?: true
    linkDokumenGabungan?: true
    processingStartedAt?: true
    submittedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Submission to aggregate.
     */
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     */
    orderBy?: SubmissionOrderByWithRelationInput | SubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Submissions
    **/
    _count?: true | SubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubmissionMaxAggregateInputType
  }

  export type GetSubmissionAggregateType<T extends SubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubmission[P]>
      : GetScalarType<T[P], AggregateSubmission[P]>
  }




  export type SubmissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubmissionWhereInput
    orderBy?: SubmissionOrderByWithAggregationInput | SubmissionOrderByWithAggregationInput[]
    by: SubmissionScalarFieldEnum[] | SubmissionScalarFieldEnum
    having?: SubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubmissionCountAggregateInputType | true
    _min?: SubmissionMinAggregateInputType
    _max?: SubmissionMaxAggregateInputType
  }

  export type SubmissionGroupByOutputType = {
    id: string
    programId: string
    token: string
    biodataValues: JsonValue
    status: string
    warnings: JsonValue
    linkDokumenGabungan: string | null
    processingStartedAt: Date | null
    submittedAt: Date
    updatedAt: Date
    _count: SubmissionCountAggregateOutputType | null
    _min: SubmissionMinAggregateOutputType | null
    _max: SubmissionMaxAggregateOutputType | null
  }

  type GetSubmissionGroupByPayload<T extends SubmissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], SubmissionGroupByOutputType[P]>
        }
      >
    >


  export type SubmissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    programId?: boolean
    token?: boolean
    biodataValues?: boolean
    status?: boolean
    warnings?: boolean
    linkDokumenGabungan?: boolean
    processingStartedAt?: boolean
    submittedAt?: boolean
    updatedAt?: boolean
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
    documents?: boolean | Submission$documentsArgs<ExtArgs>
    _count?: boolean | SubmissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["submission"]>

  export type SubmissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    programId?: boolean
    token?: boolean
    biodataValues?: boolean
    status?: boolean
    warnings?: boolean
    linkDokumenGabungan?: boolean
    processingStartedAt?: boolean
    submittedAt?: boolean
    updatedAt?: boolean
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["submission"]>

  export type SubmissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    programId?: boolean
    token?: boolean
    biodataValues?: boolean
    status?: boolean
    warnings?: boolean
    linkDokumenGabungan?: boolean
    processingStartedAt?: boolean
    submittedAt?: boolean
    updatedAt?: boolean
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["submission"]>

  export type SubmissionSelectScalar = {
    id?: boolean
    programId?: boolean
    token?: boolean
    biodataValues?: boolean
    status?: boolean
    warnings?: boolean
    linkDokumenGabungan?: boolean
    processingStartedAt?: boolean
    submittedAt?: boolean
    updatedAt?: boolean
  }

  export type SubmissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "programId" | "token" | "biodataValues" | "status" | "warnings" | "linkDokumenGabungan" | "processingStartedAt" | "submittedAt" | "updatedAt", ExtArgs["result"]["submission"]>
  export type SubmissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
    documents?: boolean | Submission$documentsArgs<ExtArgs>
    _count?: boolean | SubmissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SubmissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }
  export type SubmissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramBantuanDefaultArgs<ExtArgs>
  }

  export type $SubmissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Submission"
    objects: {
      program: Prisma.$ProgramBantuanPayload<ExtArgs>
      documents: Prisma.$SubmissionDocumentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      programId: string
      token: string
      biodataValues: Prisma.JsonValue
      status: string
      warnings: Prisma.JsonValue
      linkDokumenGabungan: string | null
      processingStartedAt: Date | null
      submittedAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["submission"]>
    composites: {}
  }

  type SubmissionGetPayload<S extends boolean | null | undefined | SubmissionDefaultArgs> = $Result.GetResult<Prisma.$SubmissionPayload, S>

  type SubmissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubmissionCountAggregateInputType | true
    }

  export interface SubmissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Submission'], meta: { name: 'Submission' } }
    /**
     * Find zero or one Submission that matches the filter.
     * @param {SubmissionFindUniqueArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubmissionFindUniqueArgs>(args: SelectSubset<T, SubmissionFindUniqueArgs<ExtArgs>>): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Submission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubmissionFindUniqueOrThrowArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubmissionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Submission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionFindFirstArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubmissionFindFirstArgs>(args?: SelectSubset<T, SubmissionFindFirstArgs<ExtArgs>>): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Submission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionFindFirstOrThrowArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubmissionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Submissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Submissions
     * const submissions = await prisma.submission.findMany()
     * 
     * // Get first 10 Submissions
     * const submissions = await prisma.submission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const submissionWithIdOnly = await prisma.submission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubmissionFindManyArgs>(args?: SelectSubset<T, SubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Submission.
     * @param {SubmissionCreateArgs} args - Arguments to create a Submission.
     * @example
     * // Create one Submission
     * const Submission = await prisma.submission.create({
     *   data: {
     *     // ... data to create a Submission
     *   }
     * })
     * 
     */
    create<T extends SubmissionCreateArgs>(args: SelectSubset<T, SubmissionCreateArgs<ExtArgs>>): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Submissions.
     * @param {SubmissionCreateManyArgs} args - Arguments to create many Submissions.
     * @example
     * // Create many Submissions
     * const submission = await prisma.submission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubmissionCreateManyArgs>(args?: SelectSubset<T, SubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Submissions and returns the data saved in the database.
     * @param {SubmissionCreateManyAndReturnArgs} args - Arguments to create many Submissions.
     * @example
     * // Create many Submissions
     * const submission = await prisma.submission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Submissions and only return the `id`
     * const submissionWithIdOnly = await prisma.submission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubmissionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Submission.
     * @param {SubmissionDeleteArgs} args - Arguments to delete one Submission.
     * @example
     * // Delete one Submission
     * const Submission = await prisma.submission.delete({
     *   where: {
     *     // ... filter to delete one Submission
     *   }
     * })
     * 
     */
    delete<T extends SubmissionDeleteArgs>(args: SelectSubset<T, SubmissionDeleteArgs<ExtArgs>>): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Submission.
     * @param {SubmissionUpdateArgs} args - Arguments to update one Submission.
     * @example
     * // Update one Submission
     * const submission = await prisma.submission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubmissionUpdateArgs>(args: SelectSubset<T, SubmissionUpdateArgs<ExtArgs>>): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Submissions.
     * @param {SubmissionDeleteManyArgs} args - Arguments to filter Submissions to delete.
     * @example
     * // Delete a few Submissions
     * const { count } = await prisma.submission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubmissionDeleteManyArgs>(args?: SelectSubset<T, SubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Submissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Submissions
     * const submission = await prisma.submission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubmissionUpdateManyArgs>(args: SelectSubset<T, SubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Submissions and returns the data updated in the database.
     * @param {SubmissionUpdateManyAndReturnArgs} args - Arguments to update many Submissions.
     * @example
     * // Update many Submissions
     * const submission = await prisma.submission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Submissions and only return the `id`
     * const submissionWithIdOnly = await prisma.submission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubmissionUpdateManyAndReturnArgs>(args: SelectSubset<T, SubmissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Submission.
     * @param {SubmissionUpsertArgs} args - Arguments to update or create a Submission.
     * @example
     * // Update or create a Submission
     * const submission = await prisma.submission.upsert({
     *   create: {
     *     // ... data to create a Submission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Submission we want to update
     *   }
     * })
     */
    upsert<T extends SubmissionUpsertArgs>(args: SelectSubset<T, SubmissionUpsertArgs<ExtArgs>>): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Submissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionCountArgs} args - Arguments to filter Submissions to count.
     * @example
     * // Count the number of Submissions
     * const count = await prisma.submission.count({
     *   where: {
     *     // ... the filter for the Submissions we want to count
     *   }
     * })
    **/
    count<T extends SubmissionCountArgs>(
      args?: Subset<T, SubmissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Submission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubmissionAggregateArgs>(args: Subset<T, SubmissionAggregateArgs>): Prisma.PrismaPromise<GetSubmissionAggregateType<T>>

    /**
     * Group by Submission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubmissionGroupByArgs['orderBy'] }
        : { orderBy?: SubmissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Submission model
   */
  readonly fields: SubmissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Submission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubmissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    program<T extends ProgramBantuanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgramBantuanDefaultArgs<ExtArgs>>): Prisma__ProgramBantuanClient<$Result.GetResult<Prisma.$ProgramBantuanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    documents<T extends Submission$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Submission$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Submission model
   */
  interface SubmissionFieldRefs {
    readonly id: FieldRef<"Submission", 'String'>
    readonly programId: FieldRef<"Submission", 'String'>
    readonly token: FieldRef<"Submission", 'String'>
    readonly biodataValues: FieldRef<"Submission", 'Json'>
    readonly status: FieldRef<"Submission", 'String'>
    readonly warnings: FieldRef<"Submission", 'Json'>
    readonly linkDokumenGabungan: FieldRef<"Submission", 'String'>
    readonly processingStartedAt: FieldRef<"Submission", 'DateTime'>
    readonly submittedAt: FieldRef<"Submission", 'DateTime'>
    readonly updatedAt: FieldRef<"Submission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Submission findUnique
   */
  export type SubmissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter, which Submission to fetch.
     */
    where: SubmissionWhereUniqueInput
  }

  /**
   * Submission findUniqueOrThrow
   */
  export type SubmissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter, which Submission to fetch.
     */
    where: SubmissionWhereUniqueInput
  }

  /**
   * Submission findFirst
   */
  export type SubmissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter, which Submission to fetch.
     */
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     */
    orderBy?: SubmissionOrderByWithRelationInput | SubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Submissions.
     */
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Submissions.
     */
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * Submission findFirstOrThrow
   */
  export type SubmissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter, which Submission to fetch.
     */
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     */
    orderBy?: SubmissionOrderByWithRelationInput | SubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Submissions.
     */
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Submissions.
     */
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * Submission findMany
   */
  export type SubmissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter, which Submissions to fetch.
     */
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     */
    orderBy?: SubmissionOrderByWithRelationInput | SubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Submissions.
     */
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Submissions.
     */
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * Submission create
   */
  export type SubmissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Submission.
     */
    data: XOR<SubmissionCreateInput, SubmissionUncheckedCreateInput>
  }

  /**
   * Submission createMany
   */
  export type SubmissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Submissions.
     */
    data: SubmissionCreateManyInput | SubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Submission createManyAndReturn
   */
  export type SubmissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * The data used to create many Submissions.
     */
    data: SubmissionCreateManyInput | SubmissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Submission update
   */
  export type SubmissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Submission.
     */
    data: XOR<SubmissionUpdateInput, SubmissionUncheckedUpdateInput>
    /**
     * Choose, which Submission to update.
     */
    where: SubmissionWhereUniqueInput
  }

  /**
   * Submission updateMany
   */
  export type SubmissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Submissions.
     */
    data: XOR<SubmissionUpdateManyMutationInput, SubmissionUncheckedUpdateManyInput>
    /**
     * Filter which Submissions to update
     */
    where?: SubmissionWhereInput
    /**
     * Limit how many Submissions to update.
     */
    limit?: number
  }

  /**
   * Submission updateManyAndReturn
   */
  export type SubmissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * The data used to update Submissions.
     */
    data: XOR<SubmissionUpdateManyMutationInput, SubmissionUncheckedUpdateManyInput>
    /**
     * Filter which Submissions to update
     */
    where?: SubmissionWhereInput
    /**
     * Limit how many Submissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Submission upsert
   */
  export type SubmissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Submission to update in case it exists.
     */
    where: SubmissionWhereUniqueInput
    /**
     * In case the Submission found by the `where` argument doesn't exist, create a new Submission with this data.
     */
    create: XOR<SubmissionCreateInput, SubmissionUncheckedCreateInput>
    /**
     * In case the Submission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubmissionUpdateInput, SubmissionUncheckedUpdateInput>
  }

  /**
   * Submission delete
   */
  export type SubmissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter which Submission to delete.
     */
    where: SubmissionWhereUniqueInput
  }

  /**
   * Submission deleteMany
   */
  export type SubmissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Submissions to delete
     */
    where?: SubmissionWhereInput
    /**
     * Limit how many Submissions to delete.
     */
    limit?: number
  }

  /**
   * Submission.documents
   */
  export type Submission$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    where?: SubmissionDocumentWhereInput
    orderBy?: SubmissionDocumentOrderByWithRelationInput | SubmissionDocumentOrderByWithRelationInput[]
    cursor?: SubmissionDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubmissionDocumentScalarFieldEnum | SubmissionDocumentScalarFieldEnum[]
  }

  /**
   * Submission without action
   */
  export type SubmissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Submission
     */
    omit?: SubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
  }


  /**
   * Model SubmissionDocument
   */

  export type AggregateSubmissionDocument = {
    _count: SubmissionDocumentCountAggregateOutputType | null
    _avg: SubmissionDocumentAvgAggregateOutputType | null
    _sum: SubmissionDocumentSumAggregateOutputType | null
    _min: SubmissionDocumentMinAggregateOutputType | null
    _max: SubmissionDocumentMaxAggregateOutputType | null
  }

  export type SubmissionDocumentAvgAggregateOutputType = {
    fileSizeBytes: number | null
  }

  export type SubmissionDocumentSumAggregateOutputType = {
    fileSizeBytes: number | null
  }

  export type SubmissionDocumentMinAggregateOutputType = {
    id: string | null
    submissionId: string | null
    documentFieldId: string | null
    fieldKey: string | null
    originalFilename: string | null
    fileUrl: string | null
    driveFileId: string | null
    fileSizeBytes: number | null
    mimeType: string | null
    ocrText: string | null
    needsRevision: boolean | null
    revisionNote: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubmissionDocumentMaxAggregateOutputType = {
    id: string | null
    submissionId: string | null
    documentFieldId: string | null
    fieldKey: string | null
    originalFilename: string | null
    fileUrl: string | null
    driveFileId: string | null
    fileSizeBytes: number | null
    mimeType: string | null
    ocrText: string | null
    needsRevision: boolean | null
    revisionNote: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubmissionDocumentCountAggregateOutputType = {
    id: number
    submissionId: number
    documentFieldId: number
    fieldKey: number
    originalFilename: number
    fileUrl: number
    driveFileId: number
    fileSizeBytes: number
    mimeType: number
    ocrText: number
    needsRevision: number
    revisionNote: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubmissionDocumentAvgAggregateInputType = {
    fileSizeBytes?: true
  }

  export type SubmissionDocumentSumAggregateInputType = {
    fileSizeBytes?: true
  }

  export type SubmissionDocumentMinAggregateInputType = {
    id?: true
    submissionId?: true
    documentFieldId?: true
    fieldKey?: true
    originalFilename?: true
    fileUrl?: true
    driveFileId?: true
    fileSizeBytes?: true
    mimeType?: true
    ocrText?: true
    needsRevision?: true
    revisionNote?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubmissionDocumentMaxAggregateInputType = {
    id?: true
    submissionId?: true
    documentFieldId?: true
    fieldKey?: true
    originalFilename?: true
    fileUrl?: true
    driveFileId?: true
    fileSizeBytes?: true
    mimeType?: true
    ocrText?: true
    needsRevision?: true
    revisionNote?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubmissionDocumentCountAggregateInputType = {
    id?: true
    submissionId?: true
    documentFieldId?: true
    fieldKey?: true
    originalFilename?: true
    fileUrl?: true
    driveFileId?: true
    fileSizeBytes?: true
    mimeType?: true
    ocrText?: true
    needsRevision?: true
    revisionNote?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubmissionDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubmissionDocument to aggregate.
     */
    where?: SubmissionDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubmissionDocuments to fetch.
     */
    orderBy?: SubmissionDocumentOrderByWithRelationInput | SubmissionDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubmissionDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubmissionDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubmissionDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubmissionDocuments
    **/
    _count?: true | SubmissionDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubmissionDocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubmissionDocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubmissionDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubmissionDocumentMaxAggregateInputType
  }

  export type GetSubmissionDocumentAggregateType<T extends SubmissionDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateSubmissionDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubmissionDocument[P]>
      : GetScalarType<T[P], AggregateSubmissionDocument[P]>
  }




  export type SubmissionDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubmissionDocumentWhereInput
    orderBy?: SubmissionDocumentOrderByWithAggregationInput | SubmissionDocumentOrderByWithAggregationInput[]
    by: SubmissionDocumentScalarFieldEnum[] | SubmissionDocumentScalarFieldEnum
    having?: SubmissionDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubmissionDocumentCountAggregateInputType | true
    _avg?: SubmissionDocumentAvgAggregateInputType
    _sum?: SubmissionDocumentSumAggregateInputType
    _min?: SubmissionDocumentMinAggregateInputType
    _max?: SubmissionDocumentMaxAggregateInputType
  }

  export type SubmissionDocumentGroupByOutputType = {
    id: string
    submissionId: string
    documentFieldId: string | null
    fieldKey: string
    originalFilename: string
    fileUrl: string
    driveFileId: string | null
    fileSizeBytes: number | null
    mimeType: string | null
    ocrText: string | null
    needsRevision: boolean
    revisionNote: string | null
    createdAt: Date
    updatedAt: Date
    _count: SubmissionDocumentCountAggregateOutputType | null
    _avg: SubmissionDocumentAvgAggregateOutputType | null
    _sum: SubmissionDocumentSumAggregateOutputType | null
    _min: SubmissionDocumentMinAggregateOutputType | null
    _max: SubmissionDocumentMaxAggregateOutputType | null
  }

  type GetSubmissionDocumentGroupByPayload<T extends SubmissionDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubmissionDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubmissionDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubmissionDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], SubmissionDocumentGroupByOutputType[P]>
        }
      >
    >


  export type SubmissionDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    documentFieldId?: boolean
    fieldKey?: boolean
    originalFilename?: boolean
    fileUrl?: boolean
    driveFileId?: boolean
    fileSizeBytes?: boolean
    mimeType?: boolean
    ocrText?: boolean
    needsRevision?: boolean
    revisionNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    submission?: boolean | SubmissionDefaultArgs<ExtArgs>
    documentField?: boolean | SubmissionDocument$documentFieldArgs<ExtArgs>
  }, ExtArgs["result"]["submissionDocument"]>

  export type SubmissionDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    documentFieldId?: boolean
    fieldKey?: boolean
    originalFilename?: boolean
    fileUrl?: boolean
    driveFileId?: boolean
    fileSizeBytes?: boolean
    mimeType?: boolean
    ocrText?: boolean
    needsRevision?: boolean
    revisionNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    submission?: boolean | SubmissionDefaultArgs<ExtArgs>
    documentField?: boolean | SubmissionDocument$documentFieldArgs<ExtArgs>
  }, ExtArgs["result"]["submissionDocument"]>

  export type SubmissionDocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    documentFieldId?: boolean
    fieldKey?: boolean
    originalFilename?: boolean
    fileUrl?: boolean
    driveFileId?: boolean
    fileSizeBytes?: boolean
    mimeType?: boolean
    ocrText?: boolean
    needsRevision?: boolean
    revisionNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    submission?: boolean | SubmissionDefaultArgs<ExtArgs>
    documentField?: boolean | SubmissionDocument$documentFieldArgs<ExtArgs>
  }, ExtArgs["result"]["submissionDocument"]>

  export type SubmissionDocumentSelectScalar = {
    id?: boolean
    submissionId?: boolean
    documentFieldId?: boolean
    fieldKey?: boolean
    originalFilename?: boolean
    fileUrl?: boolean
    driveFileId?: boolean
    fileSizeBytes?: boolean
    mimeType?: boolean
    ocrText?: boolean
    needsRevision?: boolean
    revisionNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubmissionDocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "submissionId" | "documentFieldId" | "fieldKey" | "originalFilename" | "fileUrl" | "driveFileId" | "fileSizeBytes" | "mimeType" | "ocrText" | "needsRevision" | "revisionNote" | "createdAt" | "updatedAt", ExtArgs["result"]["submissionDocument"]>
  export type SubmissionDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SubmissionDefaultArgs<ExtArgs>
    documentField?: boolean | SubmissionDocument$documentFieldArgs<ExtArgs>
  }
  export type SubmissionDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SubmissionDefaultArgs<ExtArgs>
    documentField?: boolean | SubmissionDocument$documentFieldArgs<ExtArgs>
  }
  export type SubmissionDocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SubmissionDefaultArgs<ExtArgs>
    documentField?: boolean | SubmissionDocument$documentFieldArgs<ExtArgs>
  }

  export type $SubmissionDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubmissionDocument"
    objects: {
      submission: Prisma.$SubmissionPayload<ExtArgs>
      documentField: Prisma.$DocumentFieldPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      submissionId: string
      documentFieldId: string | null
      fieldKey: string
      originalFilename: string
      fileUrl: string
      driveFileId: string | null
      fileSizeBytes: number | null
      mimeType: string | null
      ocrText: string | null
      needsRevision: boolean
      revisionNote: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["submissionDocument"]>
    composites: {}
  }

  type SubmissionDocumentGetPayload<S extends boolean | null | undefined | SubmissionDocumentDefaultArgs> = $Result.GetResult<Prisma.$SubmissionDocumentPayload, S>

  type SubmissionDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubmissionDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubmissionDocumentCountAggregateInputType | true
    }

  export interface SubmissionDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubmissionDocument'], meta: { name: 'SubmissionDocument' } }
    /**
     * Find zero or one SubmissionDocument that matches the filter.
     * @param {SubmissionDocumentFindUniqueArgs} args - Arguments to find a SubmissionDocument
     * @example
     * // Get one SubmissionDocument
     * const submissionDocument = await prisma.submissionDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubmissionDocumentFindUniqueArgs>(args: SelectSubset<T, SubmissionDocumentFindUniqueArgs<ExtArgs>>): Prisma__SubmissionDocumentClient<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubmissionDocument that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubmissionDocumentFindUniqueOrThrowArgs} args - Arguments to find a SubmissionDocument
     * @example
     * // Get one SubmissionDocument
     * const submissionDocument = await prisma.submissionDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubmissionDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, SubmissionDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubmissionDocumentClient<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubmissionDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionDocumentFindFirstArgs} args - Arguments to find a SubmissionDocument
     * @example
     * // Get one SubmissionDocument
     * const submissionDocument = await prisma.submissionDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubmissionDocumentFindFirstArgs>(args?: SelectSubset<T, SubmissionDocumentFindFirstArgs<ExtArgs>>): Prisma__SubmissionDocumentClient<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubmissionDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionDocumentFindFirstOrThrowArgs} args - Arguments to find a SubmissionDocument
     * @example
     * // Get one SubmissionDocument
     * const submissionDocument = await prisma.submissionDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubmissionDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, SubmissionDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubmissionDocumentClient<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubmissionDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubmissionDocuments
     * const submissionDocuments = await prisma.submissionDocument.findMany()
     * 
     * // Get first 10 SubmissionDocuments
     * const submissionDocuments = await prisma.submissionDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const submissionDocumentWithIdOnly = await prisma.submissionDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubmissionDocumentFindManyArgs>(args?: SelectSubset<T, SubmissionDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubmissionDocument.
     * @param {SubmissionDocumentCreateArgs} args - Arguments to create a SubmissionDocument.
     * @example
     * // Create one SubmissionDocument
     * const SubmissionDocument = await prisma.submissionDocument.create({
     *   data: {
     *     // ... data to create a SubmissionDocument
     *   }
     * })
     * 
     */
    create<T extends SubmissionDocumentCreateArgs>(args: SelectSubset<T, SubmissionDocumentCreateArgs<ExtArgs>>): Prisma__SubmissionDocumentClient<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubmissionDocuments.
     * @param {SubmissionDocumentCreateManyArgs} args - Arguments to create many SubmissionDocuments.
     * @example
     * // Create many SubmissionDocuments
     * const submissionDocument = await prisma.submissionDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubmissionDocumentCreateManyArgs>(args?: SelectSubset<T, SubmissionDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubmissionDocuments and returns the data saved in the database.
     * @param {SubmissionDocumentCreateManyAndReturnArgs} args - Arguments to create many SubmissionDocuments.
     * @example
     * // Create many SubmissionDocuments
     * const submissionDocument = await prisma.submissionDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubmissionDocuments and only return the `id`
     * const submissionDocumentWithIdOnly = await prisma.submissionDocument.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubmissionDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, SubmissionDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubmissionDocument.
     * @param {SubmissionDocumentDeleteArgs} args - Arguments to delete one SubmissionDocument.
     * @example
     * // Delete one SubmissionDocument
     * const SubmissionDocument = await prisma.submissionDocument.delete({
     *   where: {
     *     // ... filter to delete one SubmissionDocument
     *   }
     * })
     * 
     */
    delete<T extends SubmissionDocumentDeleteArgs>(args: SelectSubset<T, SubmissionDocumentDeleteArgs<ExtArgs>>): Prisma__SubmissionDocumentClient<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubmissionDocument.
     * @param {SubmissionDocumentUpdateArgs} args - Arguments to update one SubmissionDocument.
     * @example
     * // Update one SubmissionDocument
     * const submissionDocument = await prisma.submissionDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubmissionDocumentUpdateArgs>(args: SelectSubset<T, SubmissionDocumentUpdateArgs<ExtArgs>>): Prisma__SubmissionDocumentClient<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubmissionDocuments.
     * @param {SubmissionDocumentDeleteManyArgs} args - Arguments to filter SubmissionDocuments to delete.
     * @example
     * // Delete a few SubmissionDocuments
     * const { count } = await prisma.submissionDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubmissionDocumentDeleteManyArgs>(args?: SelectSubset<T, SubmissionDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubmissionDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubmissionDocuments
     * const submissionDocument = await prisma.submissionDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubmissionDocumentUpdateManyArgs>(args: SelectSubset<T, SubmissionDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubmissionDocuments and returns the data updated in the database.
     * @param {SubmissionDocumentUpdateManyAndReturnArgs} args - Arguments to update many SubmissionDocuments.
     * @example
     * // Update many SubmissionDocuments
     * const submissionDocument = await prisma.submissionDocument.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubmissionDocuments and only return the `id`
     * const submissionDocumentWithIdOnly = await prisma.submissionDocument.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubmissionDocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, SubmissionDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubmissionDocument.
     * @param {SubmissionDocumentUpsertArgs} args - Arguments to update or create a SubmissionDocument.
     * @example
     * // Update or create a SubmissionDocument
     * const submissionDocument = await prisma.submissionDocument.upsert({
     *   create: {
     *     // ... data to create a SubmissionDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubmissionDocument we want to update
     *   }
     * })
     */
    upsert<T extends SubmissionDocumentUpsertArgs>(args: SelectSubset<T, SubmissionDocumentUpsertArgs<ExtArgs>>): Prisma__SubmissionDocumentClient<$Result.GetResult<Prisma.$SubmissionDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubmissionDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionDocumentCountArgs} args - Arguments to filter SubmissionDocuments to count.
     * @example
     * // Count the number of SubmissionDocuments
     * const count = await prisma.submissionDocument.count({
     *   where: {
     *     // ... the filter for the SubmissionDocuments we want to count
     *   }
     * })
    **/
    count<T extends SubmissionDocumentCountArgs>(
      args?: Subset<T, SubmissionDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubmissionDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubmissionDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubmissionDocumentAggregateArgs>(args: Subset<T, SubmissionDocumentAggregateArgs>): Prisma.PrismaPromise<GetSubmissionDocumentAggregateType<T>>

    /**
     * Group by SubmissionDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionDocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubmissionDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubmissionDocumentGroupByArgs['orderBy'] }
        : { orderBy?: SubmissionDocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubmissionDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubmissionDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubmissionDocument model
   */
  readonly fields: SubmissionDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubmissionDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubmissionDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submission<T extends SubmissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubmissionDefaultArgs<ExtArgs>>): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    documentField<T extends SubmissionDocument$documentFieldArgs<ExtArgs> = {}>(args?: Subset<T, SubmissionDocument$documentFieldArgs<ExtArgs>>): Prisma__DocumentFieldClient<$Result.GetResult<Prisma.$DocumentFieldPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SubmissionDocument model
   */
  interface SubmissionDocumentFieldRefs {
    readonly id: FieldRef<"SubmissionDocument", 'String'>
    readonly submissionId: FieldRef<"SubmissionDocument", 'String'>
    readonly documentFieldId: FieldRef<"SubmissionDocument", 'String'>
    readonly fieldKey: FieldRef<"SubmissionDocument", 'String'>
    readonly originalFilename: FieldRef<"SubmissionDocument", 'String'>
    readonly fileUrl: FieldRef<"SubmissionDocument", 'String'>
    readonly driveFileId: FieldRef<"SubmissionDocument", 'String'>
    readonly fileSizeBytes: FieldRef<"SubmissionDocument", 'Int'>
    readonly mimeType: FieldRef<"SubmissionDocument", 'String'>
    readonly ocrText: FieldRef<"SubmissionDocument", 'String'>
    readonly needsRevision: FieldRef<"SubmissionDocument", 'Boolean'>
    readonly revisionNote: FieldRef<"SubmissionDocument", 'String'>
    readonly createdAt: FieldRef<"SubmissionDocument", 'DateTime'>
    readonly updatedAt: FieldRef<"SubmissionDocument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubmissionDocument findUnique
   */
  export type SubmissionDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    /**
     * Filter, which SubmissionDocument to fetch.
     */
    where: SubmissionDocumentWhereUniqueInput
  }

  /**
   * SubmissionDocument findUniqueOrThrow
   */
  export type SubmissionDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    /**
     * Filter, which SubmissionDocument to fetch.
     */
    where: SubmissionDocumentWhereUniqueInput
  }

  /**
   * SubmissionDocument findFirst
   */
  export type SubmissionDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    /**
     * Filter, which SubmissionDocument to fetch.
     */
    where?: SubmissionDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubmissionDocuments to fetch.
     */
    orderBy?: SubmissionDocumentOrderByWithRelationInput | SubmissionDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubmissionDocuments.
     */
    cursor?: SubmissionDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubmissionDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubmissionDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubmissionDocuments.
     */
    distinct?: SubmissionDocumentScalarFieldEnum | SubmissionDocumentScalarFieldEnum[]
  }

  /**
   * SubmissionDocument findFirstOrThrow
   */
  export type SubmissionDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    /**
     * Filter, which SubmissionDocument to fetch.
     */
    where?: SubmissionDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubmissionDocuments to fetch.
     */
    orderBy?: SubmissionDocumentOrderByWithRelationInput | SubmissionDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubmissionDocuments.
     */
    cursor?: SubmissionDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubmissionDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubmissionDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubmissionDocuments.
     */
    distinct?: SubmissionDocumentScalarFieldEnum | SubmissionDocumentScalarFieldEnum[]
  }

  /**
   * SubmissionDocument findMany
   */
  export type SubmissionDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    /**
     * Filter, which SubmissionDocuments to fetch.
     */
    where?: SubmissionDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubmissionDocuments to fetch.
     */
    orderBy?: SubmissionDocumentOrderByWithRelationInput | SubmissionDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubmissionDocuments.
     */
    cursor?: SubmissionDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubmissionDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubmissionDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubmissionDocuments.
     */
    distinct?: SubmissionDocumentScalarFieldEnum | SubmissionDocumentScalarFieldEnum[]
  }

  /**
   * SubmissionDocument create
   */
  export type SubmissionDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a SubmissionDocument.
     */
    data: XOR<SubmissionDocumentCreateInput, SubmissionDocumentUncheckedCreateInput>
  }

  /**
   * SubmissionDocument createMany
   */
  export type SubmissionDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubmissionDocuments.
     */
    data: SubmissionDocumentCreateManyInput | SubmissionDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubmissionDocument createManyAndReturn
   */
  export type SubmissionDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * The data used to create many SubmissionDocuments.
     */
    data: SubmissionDocumentCreateManyInput | SubmissionDocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubmissionDocument update
   */
  export type SubmissionDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a SubmissionDocument.
     */
    data: XOR<SubmissionDocumentUpdateInput, SubmissionDocumentUncheckedUpdateInput>
    /**
     * Choose, which SubmissionDocument to update.
     */
    where: SubmissionDocumentWhereUniqueInput
  }

  /**
   * SubmissionDocument updateMany
   */
  export type SubmissionDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubmissionDocuments.
     */
    data: XOR<SubmissionDocumentUpdateManyMutationInput, SubmissionDocumentUncheckedUpdateManyInput>
    /**
     * Filter which SubmissionDocuments to update
     */
    where?: SubmissionDocumentWhereInput
    /**
     * Limit how many SubmissionDocuments to update.
     */
    limit?: number
  }

  /**
   * SubmissionDocument updateManyAndReturn
   */
  export type SubmissionDocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * The data used to update SubmissionDocuments.
     */
    data: XOR<SubmissionDocumentUpdateManyMutationInput, SubmissionDocumentUncheckedUpdateManyInput>
    /**
     * Filter which SubmissionDocuments to update
     */
    where?: SubmissionDocumentWhereInput
    /**
     * Limit how many SubmissionDocuments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubmissionDocument upsert
   */
  export type SubmissionDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the SubmissionDocument to update in case it exists.
     */
    where: SubmissionDocumentWhereUniqueInput
    /**
     * In case the SubmissionDocument found by the `where` argument doesn't exist, create a new SubmissionDocument with this data.
     */
    create: XOR<SubmissionDocumentCreateInput, SubmissionDocumentUncheckedCreateInput>
    /**
     * In case the SubmissionDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubmissionDocumentUpdateInput, SubmissionDocumentUncheckedUpdateInput>
  }

  /**
   * SubmissionDocument delete
   */
  export type SubmissionDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
    /**
     * Filter which SubmissionDocument to delete.
     */
    where: SubmissionDocumentWhereUniqueInput
  }

  /**
   * SubmissionDocument deleteMany
   */
  export type SubmissionDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubmissionDocuments to delete
     */
    where?: SubmissionDocumentWhereInput
    /**
     * Limit how many SubmissionDocuments to delete.
     */
    limit?: number
  }

  /**
   * SubmissionDocument.documentField
   */
  export type SubmissionDocument$documentFieldArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentField
     */
    select?: DocumentFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentField
     */
    omit?: DocumentFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentFieldInclude<ExtArgs> | null
    where?: DocumentFieldWhereInput
  }

  /**
   * SubmissionDocument without action
   */
  export type SubmissionDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionDocument
     */
    select?: SubmissionDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubmissionDocument
     */
    omit?: SubmissionDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionDocumentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProgramBantuanScalarFieldEnum: {
    id: 'id',
    nama: 'nama',
    slug: 'slug',
    deskripsi: 'deskripsi',
    gambarUrl: 'gambarUrl',
    status: 'status',
    tanggalBuka: 'tanggalBuka',
    tanggalTutup: 'tanggalTutup',
    linkDriveTemplate: 'linkDriveTemplate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProgramBantuanScalarFieldEnum = (typeof ProgramBantuanScalarFieldEnum)[keyof typeof ProgramBantuanScalarFieldEnum]


  export const DocumentFieldScalarFieldEnum: {
    id: 'id',
    programId: 'programId',
    key: 'key',
    label: 'label',
    required: 'required',
    maxAgeMonths: 'maxAgeMonths',
    expectedKeywords: 'expectedKeywords',
    nameCheckApplicable: 'nameCheckApplicable',
    isSingleCombinedUpload: 'isSingleCombinedUpload',
    needsStampCheck: 'needsStampCheck',
    order: 'order',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentFieldScalarFieldEnum = (typeof DocumentFieldScalarFieldEnum)[keyof typeof DocumentFieldScalarFieldEnum]


  export const BiodataFieldScalarFieldEnum: {
    id: 'id',
    programId: 'programId',
    key: 'key',
    label: 'label',
    tipe: 'tipe',
    options: 'options',
    required: 'required',
    order: 'order',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BiodataFieldScalarFieldEnum = (typeof BiodataFieldScalarFieldEnum)[keyof typeof BiodataFieldScalarFieldEnum]


  export const SubmissionScalarFieldEnum: {
    id: 'id',
    programId: 'programId',
    token: 'token',
    biodataValues: 'biodataValues',
    status: 'status',
    warnings: 'warnings',
    linkDokumenGabungan: 'linkDokumenGabungan',
    processingStartedAt: 'processingStartedAt',
    submittedAt: 'submittedAt',
    updatedAt: 'updatedAt'
  };

  export type SubmissionScalarFieldEnum = (typeof SubmissionScalarFieldEnum)[keyof typeof SubmissionScalarFieldEnum]


  export const SubmissionDocumentScalarFieldEnum: {
    id: 'id',
    submissionId: 'submissionId',
    documentFieldId: 'documentFieldId',
    fieldKey: 'fieldKey',
    originalFilename: 'originalFilename',
    fileUrl: 'fileUrl',
    driveFileId: 'driveFileId',
    fileSizeBytes: 'fileSizeBytes',
    mimeType: 'mimeType',
    ocrText: 'ocrText',
    needsRevision: 'needsRevision',
    revisionNote: 'revisionNote',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubmissionDocumentScalarFieldEnum = (typeof SubmissionDocumentScalarFieldEnum)[keyof typeof SubmissionDocumentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ProgramBantuanWhereInput = {
    AND?: ProgramBantuanWhereInput | ProgramBantuanWhereInput[]
    OR?: ProgramBantuanWhereInput[]
    NOT?: ProgramBantuanWhereInput | ProgramBantuanWhereInput[]
    id?: StringFilter<"ProgramBantuan"> | string
    nama?: StringFilter<"ProgramBantuan"> | string
    slug?: StringFilter<"ProgramBantuan"> | string
    deskripsi?: StringNullableFilter<"ProgramBantuan"> | string | null
    gambarUrl?: StringNullableFilter<"ProgramBantuan"> | string | null
    status?: StringFilter<"ProgramBantuan"> | string
    tanggalBuka?: DateTimeNullableFilter<"ProgramBantuan"> | Date | string | null
    tanggalTutup?: DateTimeNullableFilter<"ProgramBantuan"> | Date | string | null
    linkDriveTemplate?: StringNullableFilter<"ProgramBantuan"> | string | null
    createdAt?: DateTimeFilter<"ProgramBantuan"> | Date | string
    updatedAt?: DateTimeFilter<"ProgramBantuan"> | Date | string
    documentFields?: DocumentFieldListRelationFilter
    biodataFields?: BiodataFieldListRelationFilter
    submissions?: SubmissionListRelationFilter
  }

  export type ProgramBantuanOrderByWithRelationInput = {
    id?: SortOrder
    nama?: SortOrder
    slug?: SortOrder
    deskripsi?: SortOrderInput | SortOrder
    gambarUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    tanggalBuka?: SortOrderInput | SortOrder
    tanggalTutup?: SortOrderInput | SortOrder
    linkDriveTemplate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    documentFields?: DocumentFieldOrderByRelationAggregateInput
    biodataFields?: BiodataFieldOrderByRelationAggregateInput
    submissions?: SubmissionOrderByRelationAggregateInput
  }

  export type ProgramBantuanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ProgramBantuanWhereInput | ProgramBantuanWhereInput[]
    OR?: ProgramBantuanWhereInput[]
    NOT?: ProgramBantuanWhereInput | ProgramBantuanWhereInput[]
    nama?: StringFilter<"ProgramBantuan"> | string
    deskripsi?: StringNullableFilter<"ProgramBantuan"> | string | null
    gambarUrl?: StringNullableFilter<"ProgramBantuan"> | string | null
    status?: StringFilter<"ProgramBantuan"> | string
    tanggalBuka?: DateTimeNullableFilter<"ProgramBantuan"> | Date | string | null
    tanggalTutup?: DateTimeNullableFilter<"ProgramBantuan"> | Date | string | null
    linkDriveTemplate?: StringNullableFilter<"ProgramBantuan"> | string | null
    createdAt?: DateTimeFilter<"ProgramBantuan"> | Date | string
    updatedAt?: DateTimeFilter<"ProgramBantuan"> | Date | string
    documentFields?: DocumentFieldListRelationFilter
    biodataFields?: BiodataFieldListRelationFilter
    submissions?: SubmissionListRelationFilter
  }, "id" | "slug">

  export type ProgramBantuanOrderByWithAggregationInput = {
    id?: SortOrder
    nama?: SortOrder
    slug?: SortOrder
    deskripsi?: SortOrderInput | SortOrder
    gambarUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    tanggalBuka?: SortOrderInput | SortOrder
    tanggalTutup?: SortOrderInput | SortOrder
    linkDriveTemplate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProgramBantuanCountOrderByAggregateInput
    _max?: ProgramBantuanMaxOrderByAggregateInput
    _min?: ProgramBantuanMinOrderByAggregateInput
  }

  export type ProgramBantuanScalarWhereWithAggregatesInput = {
    AND?: ProgramBantuanScalarWhereWithAggregatesInput | ProgramBantuanScalarWhereWithAggregatesInput[]
    OR?: ProgramBantuanScalarWhereWithAggregatesInput[]
    NOT?: ProgramBantuanScalarWhereWithAggregatesInput | ProgramBantuanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProgramBantuan"> | string
    nama?: StringWithAggregatesFilter<"ProgramBantuan"> | string
    slug?: StringWithAggregatesFilter<"ProgramBantuan"> | string
    deskripsi?: StringNullableWithAggregatesFilter<"ProgramBantuan"> | string | null
    gambarUrl?: StringNullableWithAggregatesFilter<"ProgramBantuan"> | string | null
    status?: StringWithAggregatesFilter<"ProgramBantuan"> | string
    tanggalBuka?: DateTimeNullableWithAggregatesFilter<"ProgramBantuan"> | Date | string | null
    tanggalTutup?: DateTimeNullableWithAggregatesFilter<"ProgramBantuan"> | Date | string | null
    linkDriveTemplate?: StringNullableWithAggregatesFilter<"ProgramBantuan"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProgramBantuan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProgramBantuan"> | Date | string
  }

  export type DocumentFieldWhereInput = {
    AND?: DocumentFieldWhereInput | DocumentFieldWhereInput[]
    OR?: DocumentFieldWhereInput[]
    NOT?: DocumentFieldWhereInput | DocumentFieldWhereInput[]
    id?: StringFilter<"DocumentField"> | string
    programId?: StringFilter<"DocumentField"> | string
    key?: StringFilter<"DocumentField"> | string
    label?: StringFilter<"DocumentField"> | string
    required?: BoolFilter<"DocumentField"> | boolean
    maxAgeMonths?: IntNullableFilter<"DocumentField"> | number | null
    expectedKeywords?: StringNullableListFilter<"DocumentField">
    nameCheckApplicable?: BoolFilter<"DocumentField"> | boolean
    isSingleCombinedUpload?: BoolFilter<"DocumentField"> | boolean
    needsStampCheck?: BoolFilter<"DocumentField"> | boolean
    order?: IntFilter<"DocumentField"> | number
    createdAt?: DateTimeFilter<"DocumentField"> | Date | string
    updatedAt?: DateTimeFilter<"DocumentField"> | Date | string
    program?: XOR<ProgramBantuanScalarRelationFilter, ProgramBantuanWhereInput>
    documents?: SubmissionDocumentListRelationFilter
  }

  export type DocumentFieldOrderByWithRelationInput = {
    id?: SortOrder
    programId?: SortOrder
    key?: SortOrder
    label?: SortOrder
    required?: SortOrder
    maxAgeMonths?: SortOrderInput | SortOrder
    expectedKeywords?: SortOrder
    nameCheckApplicable?: SortOrder
    isSingleCombinedUpload?: SortOrder
    needsStampCheck?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    program?: ProgramBantuanOrderByWithRelationInput
    documents?: SubmissionDocumentOrderByRelationAggregateInput
  }

  export type DocumentFieldWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    programId_key?: DocumentFieldProgramIdKeyCompoundUniqueInput
    AND?: DocumentFieldWhereInput | DocumentFieldWhereInput[]
    OR?: DocumentFieldWhereInput[]
    NOT?: DocumentFieldWhereInput | DocumentFieldWhereInput[]
    programId?: StringFilter<"DocumentField"> | string
    key?: StringFilter<"DocumentField"> | string
    label?: StringFilter<"DocumentField"> | string
    required?: BoolFilter<"DocumentField"> | boolean
    maxAgeMonths?: IntNullableFilter<"DocumentField"> | number | null
    expectedKeywords?: StringNullableListFilter<"DocumentField">
    nameCheckApplicable?: BoolFilter<"DocumentField"> | boolean
    isSingleCombinedUpload?: BoolFilter<"DocumentField"> | boolean
    needsStampCheck?: BoolFilter<"DocumentField"> | boolean
    order?: IntFilter<"DocumentField"> | number
    createdAt?: DateTimeFilter<"DocumentField"> | Date | string
    updatedAt?: DateTimeFilter<"DocumentField"> | Date | string
    program?: XOR<ProgramBantuanScalarRelationFilter, ProgramBantuanWhereInput>
    documents?: SubmissionDocumentListRelationFilter
  }, "id" | "programId_key">

  export type DocumentFieldOrderByWithAggregationInput = {
    id?: SortOrder
    programId?: SortOrder
    key?: SortOrder
    label?: SortOrder
    required?: SortOrder
    maxAgeMonths?: SortOrderInput | SortOrder
    expectedKeywords?: SortOrder
    nameCheckApplicable?: SortOrder
    isSingleCombinedUpload?: SortOrder
    needsStampCheck?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentFieldCountOrderByAggregateInput
    _avg?: DocumentFieldAvgOrderByAggregateInput
    _max?: DocumentFieldMaxOrderByAggregateInput
    _min?: DocumentFieldMinOrderByAggregateInput
    _sum?: DocumentFieldSumOrderByAggregateInput
  }

  export type DocumentFieldScalarWhereWithAggregatesInput = {
    AND?: DocumentFieldScalarWhereWithAggregatesInput | DocumentFieldScalarWhereWithAggregatesInput[]
    OR?: DocumentFieldScalarWhereWithAggregatesInput[]
    NOT?: DocumentFieldScalarWhereWithAggregatesInput | DocumentFieldScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DocumentField"> | string
    programId?: StringWithAggregatesFilter<"DocumentField"> | string
    key?: StringWithAggregatesFilter<"DocumentField"> | string
    label?: StringWithAggregatesFilter<"DocumentField"> | string
    required?: BoolWithAggregatesFilter<"DocumentField"> | boolean
    maxAgeMonths?: IntNullableWithAggregatesFilter<"DocumentField"> | number | null
    expectedKeywords?: StringNullableListFilter<"DocumentField">
    nameCheckApplicable?: BoolWithAggregatesFilter<"DocumentField"> | boolean
    isSingleCombinedUpload?: BoolWithAggregatesFilter<"DocumentField"> | boolean
    needsStampCheck?: BoolWithAggregatesFilter<"DocumentField"> | boolean
    order?: IntWithAggregatesFilter<"DocumentField"> | number
    createdAt?: DateTimeWithAggregatesFilter<"DocumentField"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DocumentField"> | Date | string
  }

  export type BiodataFieldWhereInput = {
    AND?: BiodataFieldWhereInput | BiodataFieldWhereInput[]
    OR?: BiodataFieldWhereInput[]
    NOT?: BiodataFieldWhereInput | BiodataFieldWhereInput[]
    id?: StringFilter<"BiodataField"> | string
    programId?: StringFilter<"BiodataField"> | string
    key?: StringFilter<"BiodataField"> | string
    label?: StringFilter<"BiodataField"> | string
    tipe?: StringFilter<"BiodataField"> | string
    options?: StringNullableListFilter<"BiodataField">
    required?: BoolFilter<"BiodataField"> | boolean
    order?: IntFilter<"BiodataField"> | number
    createdAt?: DateTimeFilter<"BiodataField"> | Date | string
    updatedAt?: DateTimeFilter<"BiodataField"> | Date | string
    program?: XOR<ProgramBantuanScalarRelationFilter, ProgramBantuanWhereInput>
  }

  export type BiodataFieldOrderByWithRelationInput = {
    id?: SortOrder
    programId?: SortOrder
    key?: SortOrder
    label?: SortOrder
    tipe?: SortOrder
    options?: SortOrder
    required?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    program?: ProgramBantuanOrderByWithRelationInput
  }

  export type BiodataFieldWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    programId_key?: BiodataFieldProgramIdKeyCompoundUniqueInput
    AND?: BiodataFieldWhereInput | BiodataFieldWhereInput[]
    OR?: BiodataFieldWhereInput[]
    NOT?: BiodataFieldWhereInput | BiodataFieldWhereInput[]
    programId?: StringFilter<"BiodataField"> | string
    key?: StringFilter<"BiodataField"> | string
    label?: StringFilter<"BiodataField"> | string
    tipe?: StringFilter<"BiodataField"> | string
    options?: StringNullableListFilter<"BiodataField">
    required?: BoolFilter<"BiodataField"> | boolean
    order?: IntFilter<"BiodataField"> | number
    createdAt?: DateTimeFilter<"BiodataField"> | Date | string
    updatedAt?: DateTimeFilter<"BiodataField"> | Date | string
    program?: XOR<ProgramBantuanScalarRelationFilter, ProgramBantuanWhereInput>
  }, "id" | "programId_key">

  export type BiodataFieldOrderByWithAggregationInput = {
    id?: SortOrder
    programId?: SortOrder
    key?: SortOrder
    label?: SortOrder
    tipe?: SortOrder
    options?: SortOrder
    required?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BiodataFieldCountOrderByAggregateInput
    _avg?: BiodataFieldAvgOrderByAggregateInput
    _max?: BiodataFieldMaxOrderByAggregateInput
    _min?: BiodataFieldMinOrderByAggregateInput
    _sum?: BiodataFieldSumOrderByAggregateInput
  }

  export type BiodataFieldScalarWhereWithAggregatesInput = {
    AND?: BiodataFieldScalarWhereWithAggregatesInput | BiodataFieldScalarWhereWithAggregatesInput[]
    OR?: BiodataFieldScalarWhereWithAggregatesInput[]
    NOT?: BiodataFieldScalarWhereWithAggregatesInput | BiodataFieldScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BiodataField"> | string
    programId?: StringWithAggregatesFilter<"BiodataField"> | string
    key?: StringWithAggregatesFilter<"BiodataField"> | string
    label?: StringWithAggregatesFilter<"BiodataField"> | string
    tipe?: StringWithAggregatesFilter<"BiodataField"> | string
    options?: StringNullableListFilter<"BiodataField">
    required?: BoolWithAggregatesFilter<"BiodataField"> | boolean
    order?: IntWithAggregatesFilter<"BiodataField"> | number
    createdAt?: DateTimeWithAggregatesFilter<"BiodataField"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BiodataField"> | Date | string
  }

  export type SubmissionWhereInput = {
    AND?: SubmissionWhereInput | SubmissionWhereInput[]
    OR?: SubmissionWhereInput[]
    NOT?: SubmissionWhereInput | SubmissionWhereInput[]
    id?: StringFilter<"Submission"> | string
    programId?: StringFilter<"Submission"> | string
    token?: StringFilter<"Submission"> | string
    biodataValues?: JsonFilter<"Submission">
    status?: StringFilter<"Submission"> | string
    warnings?: JsonFilter<"Submission">
    linkDokumenGabungan?: StringNullableFilter<"Submission"> | string | null
    processingStartedAt?: DateTimeNullableFilter<"Submission"> | Date | string | null
    submittedAt?: DateTimeFilter<"Submission"> | Date | string
    updatedAt?: DateTimeFilter<"Submission"> | Date | string
    program?: XOR<ProgramBantuanScalarRelationFilter, ProgramBantuanWhereInput>
    documents?: SubmissionDocumentListRelationFilter
  }

  export type SubmissionOrderByWithRelationInput = {
    id?: SortOrder
    programId?: SortOrder
    token?: SortOrder
    biodataValues?: SortOrder
    status?: SortOrder
    warnings?: SortOrder
    linkDokumenGabungan?: SortOrderInput | SortOrder
    processingStartedAt?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
    program?: ProgramBantuanOrderByWithRelationInput
    documents?: SubmissionDocumentOrderByRelationAggregateInput
  }

  export type SubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SubmissionWhereInput | SubmissionWhereInput[]
    OR?: SubmissionWhereInput[]
    NOT?: SubmissionWhereInput | SubmissionWhereInput[]
    programId?: StringFilter<"Submission"> | string
    biodataValues?: JsonFilter<"Submission">
    status?: StringFilter<"Submission"> | string
    warnings?: JsonFilter<"Submission">
    linkDokumenGabungan?: StringNullableFilter<"Submission"> | string | null
    processingStartedAt?: DateTimeNullableFilter<"Submission"> | Date | string | null
    submittedAt?: DateTimeFilter<"Submission"> | Date | string
    updatedAt?: DateTimeFilter<"Submission"> | Date | string
    program?: XOR<ProgramBantuanScalarRelationFilter, ProgramBantuanWhereInput>
    documents?: SubmissionDocumentListRelationFilter
  }, "id" | "token">

  export type SubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    programId?: SortOrder
    token?: SortOrder
    biodataValues?: SortOrder
    status?: SortOrder
    warnings?: SortOrder
    linkDokumenGabungan?: SortOrderInput | SortOrder
    processingStartedAt?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubmissionCountOrderByAggregateInput
    _max?: SubmissionMaxOrderByAggregateInput
    _min?: SubmissionMinOrderByAggregateInput
  }

  export type SubmissionScalarWhereWithAggregatesInput = {
    AND?: SubmissionScalarWhereWithAggregatesInput | SubmissionScalarWhereWithAggregatesInput[]
    OR?: SubmissionScalarWhereWithAggregatesInput[]
    NOT?: SubmissionScalarWhereWithAggregatesInput | SubmissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Submission"> | string
    programId?: StringWithAggregatesFilter<"Submission"> | string
    token?: StringWithAggregatesFilter<"Submission"> | string
    biodataValues?: JsonWithAggregatesFilter<"Submission">
    status?: StringWithAggregatesFilter<"Submission"> | string
    warnings?: JsonWithAggregatesFilter<"Submission">
    linkDokumenGabungan?: StringNullableWithAggregatesFilter<"Submission"> | string | null
    processingStartedAt?: DateTimeNullableWithAggregatesFilter<"Submission"> | Date | string | null
    submittedAt?: DateTimeWithAggregatesFilter<"Submission"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Submission"> | Date | string
  }

  export type SubmissionDocumentWhereInput = {
    AND?: SubmissionDocumentWhereInput | SubmissionDocumentWhereInput[]
    OR?: SubmissionDocumentWhereInput[]
    NOT?: SubmissionDocumentWhereInput | SubmissionDocumentWhereInput[]
    id?: StringFilter<"SubmissionDocument"> | string
    submissionId?: StringFilter<"SubmissionDocument"> | string
    documentFieldId?: StringNullableFilter<"SubmissionDocument"> | string | null
    fieldKey?: StringFilter<"SubmissionDocument"> | string
    originalFilename?: StringFilter<"SubmissionDocument"> | string
    fileUrl?: StringFilter<"SubmissionDocument"> | string
    driveFileId?: StringNullableFilter<"SubmissionDocument"> | string | null
    fileSizeBytes?: IntNullableFilter<"SubmissionDocument"> | number | null
    mimeType?: StringNullableFilter<"SubmissionDocument"> | string | null
    ocrText?: StringNullableFilter<"SubmissionDocument"> | string | null
    needsRevision?: BoolFilter<"SubmissionDocument"> | boolean
    revisionNote?: StringNullableFilter<"SubmissionDocument"> | string | null
    createdAt?: DateTimeFilter<"SubmissionDocument"> | Date | string
    updatedAt?: DateTimeFilter<"SubmissionDocument"> | Date | string
    submission?: XOR<SubmissionScalarRelationFilter, SubmissionWhereInput>
    documentField?: XOR<DocumentFieldNullableScalarRelationFilter, DocumentFieldWhereInput> | null
  }

  export type SubmissionDocumentOrderByWithRelationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    documentFieldId?: SortOrderInput | SortOrder
    fieldKey?: SortOrder
    originalFilename?: SortOrder
    fileUrl?: SortOrder
    driveFileId?: SortOrderInput | SortOrder
    fileSizeBytes?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    ocrText?: SortOrderInput | SortOrder
    needsRevision?: SortOrder
    revisionNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    submission?: SubmissionOrderByWithRelationInput
    documentField?: DocumentFieldOrderByWithRelationInput
  }

  export type SubmissionDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubmissionDocumentWhereInput | SubmissionDocumentWhereInput[]
    OR?: SubmissionDocumentWhereInput[]
    NOT?: SubmissionDocumentWhereInput | SubmissionDocumentWhereInput[]
    submissionId?: StringFilter<"SubmissionDocument"> | string
    documentFieldId?: StringNullableFilter<"SubmissionDocument"> | string | null
    fieldKey?: StringFilter<"SubmissionDocument"> | string
    originalFilename?: StringFilter<"SubmissionDocument"> | string
    fileUrl?: StringFilter<"SubmissionDocument"> | string
    driveFileId?: StringNullableFilter<"SubmissionDocument"> | string | null
    fileSizeBytes?: IntNullableFilter<"SubmissionDocument"> | number | null
    mimeType?: StringNullableFilter<"SubmissionDocument"> | string | null
    ocrText?: StringNullableFilter<"SubmissionDocument"> | string | null
    needsRevision?: BoolFilter<"SubmissionDocument"> | boolean
    revisionNote?: StringNullableFilter<"SubmissionDocument"> | string | null
    createdAt?: DateTimeFilter<"SubmissionDocument"> | Date | string
    updatedAt?: DateTimeFilter<"SubmissionDocument"> | Date | string
    submission?: XOR<SubmissionScalarRelationFilter, SubmissionWhereInput>
    documentField?: XOR<DocumentFieldNullableScalarRelationFilter, DocumentFieldWhereInput> | null
  }, "id">

  export type SubmissionDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    documentFieldId?: SortOrderInput | SortOrder
    fieldKey?: SortOrder
    originalFilename?: SortOrder
    fileUrl?: SortOrder
    driveFileId?: SortOrderInput | SortOrder
    fileSizeBytes?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    ocrText?: SortOrderInput | SortOrder
    needsRevision?: SortOrder
    revisionNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubmissionDocumentCountOrderByAggregateInput
    _avg?: SubmissionDocumentAvgOrderByAggregateInput
    _max?: SubmissionDocumentMaxOrderByAggregateInput
    _min?: SubmissionDocumentMinOrderByAggregateInput
    _sum?: SubmissionDocumentSumOrderByAggregateInput
  }

  export type SubmissionDocumentScalarWhereWithAggregatesInput = {
    AND?: SubmissionDocumentScalarWhereWithAggregatesInput | SubmissionDocumentScalarWhereWithAggregatesInput[]
    OR?: SubmissionDocumentScalarWhereWithAggregatesInput[]
    NOT?: SubmissionDocumentScalarWhereWithAggregatesInput | SubmissionDocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SubmissionDocument"> | string
    submissionId?: StringWithAggregatesFilter<"SubmissionDocument"> | string
    documentFieldId?: StringNullableWithAggregatesFilter<"SubmissionDocument"> | string | null
    fieldKey?: StringWithAggregatesFilter<"SubmissionDocument"> | string
    originalFilename?: StringWithAggregatesFilter<"SubmissionDocument"> | string
    fileUrl?: StringWithAggregatesFilter<"SubmissionDocument"> | string
    driveFileId?: StringNullableWithAggregatesFilter<"SubmissionDocument"> | string | null
    fileSizeBytes?: IntNullableWithAggregatesFilter<"SubmissionDocument"> | number | null
    mimeType?: StringNullableWithAggregatesFilter<"SubmissionDocument"> | string | null
    ocrText?: StringNullableWithAggregatesFilter<"SubmissionDocument"> | string | null
    needsRevision?: BoolWithAggregatesFilter<"SubmissionDocument"> | boolean
    revisionNote?: StringNullableWithAggregatesFilter<"SubmissionDocument"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SubmissionDocument"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SubmissionDocument"> | Date | string
  }

  export type ProgramBantuanCreateInput = {
    id?: string
    nama: string
    slug: string
    deskripsi?: string | null
    gambarUrl?: string | null
    status?: string
    tanggalBuka?: Date | string | null
    tanggalTutup?: Date | string | null
    linkDriveTemplate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documentFields?: DocumentFieldCreateNestedManyWithoutProgramInput
    biodataFields?: BiodataFieldCreateNestedManyWithoutProgramInput
    submissions?: SubmissionCreateNestedManyWithoutProgramInput
  }

  export type ProgramBantuanUncheckedCreateInput = {
    id?: string
    nama: string
    slug: string
    deskripsi?: string | null
    gambarUrl?: string | null
    status?: string
    tanggalBuka?: Date | string | null
    tanggalTutup?: Date | string | null
    linkDriveTemplate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documentFields?: DocumentFieldUncheckedCreateNestedManyWithoutProgramInput
    biodataFields?: BiodataFieldUncheckedCreateNestedManyWithoutProgramInput
    submissions?: SubmissionUncheckedCreateNestedManyWithoutProgramInput
  }

  export type ProgramBantuanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    deskripsi?: NullableStringFieldUpdateOperationsInput | string | null
    gambarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tanggalBuka?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalTutup?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkDriveTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documentFields?: DocumentFieldUpdateManyWithoutProgramNestedInput
    biodataFields?: BiodataFieldUpdateManyWithoutProgramNestedInput
    submissions?: SubmissionUpdateManyWithoutProgramNestedInput
  }

  export type ProgramBantuanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    deskripsi?: NullableStringFieldUpdateOperationsInput | string | null
    gambarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tanggalBuka?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalTutup?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkDriveTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documentFields?: DocumentFieldUncheckedUpdateManyWithoutProgramNestedInput
    biodataFields?: BiodataFieldUncheckedUpdateManyWithoutProgramNestedInput
    submissions?: SubmissionUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type ProgramBantuanCreateManyInput = {
    id?: string
    nama: string
    slug: string
    deskripsi?: string | null
    gambarUrl?: string | null
    status?: string
    tanggalBuka?: Date | string | null
    tanggalTutup?: Date | string | null
    linkDriveTemplate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramBantuanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    deskripsi?: NullableStringFieldUpdateOperationsInput | string | null
    gambarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tanggalBuka?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalTutup?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkDriveTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramBantuanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    deskripsi?: NullableStringFieldUpdateOperationsInput | string | null
    gambarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tanggalBuka?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalTutup?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkDriveTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentFieldCreateInput = {
    id?: string
    key: string
    label: string
    required?: boolean
    maxAgeMonths?: number | null
    expectedKeywords?: DocumentFieldCreateexpectedKeywordsInput | string[]
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    program: ProgramBantuanCreateNestedOneWithoutDocumentFieldsInput
    documents?: SubmissionDocumentCreateNestedManyWithoutDocumentFieldInput
  }

  export type DocumentFieldUncheckedCreateInput = {
    id?: string
    programId: string
    key: string
    label: string
    required?: boolean
    maxAgeMonths?: number | null
    expectedKeywords?: DocumentFieldCreateexpectedKeywordsInput | string[]
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: SubmissionDocumentUncheckedCreateNestedManyWithoutDocumentFieldInput
  }

  export type DocumentFieldUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    required?: BoolFieldUpdateOperationsInput | boolean
    maxAgeMonths?: NullableIntFieldUpdateOperationsInput | number | null
    expectedKeywords?: DocumentFieldUpdateexpectedKeywordsInput | string[]
    nameCheckApplicable?: BoolFieldUpdateOperationsInput | boolean
    isSingleCombinedUpload?: BoolFieldUpdateOperationsInput | boolean
    needsStampCheck?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    program?: ProgramBantuanUpdateOneRequiredWithoutDocumentFieldsNestedInput
    documents?: SubmissionDocumentUpdateManyWithoutDocumentFieldNestedInput
  }

  export type DocumentFieldUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    required?: BoolFieldUpdateOperationsInput | boolean
    maxAgeMonths?: NullableIntFieldUpdateOperationsInput | number | null
    expectedKeywords?: DocumentFieldUpdateexpectedKeywordsInput | string[]
    nameCheckApplicable?: BoolFieldUpdateOperationsInput | boolean
    isSingleCombinedUpload?: BoolFieldUpdateOperationsInput | boolean
    needsStampCheck?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: SubmissionDocumentUncheckedUpdateManyWithoutDocumentFieldNestedInput
  }

  export type DocumentFieldCreateManyInput = {
    id?: string
    programId: string
    key: string
    label: string
    required?: boolean
    maxAgeMonths?: number | null
    expectedKeywords?: DocumentFieldCreateexpectedKeywordsInput | string[]
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentFieldUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    required?: BoolFieldUpdateOperationsInput | boolean
    maxAgeMonths?: NullableIntFieldUpdateOperationsInput | number | null
    expectedKeywords?: DocumentFieldUpdateexpectedKeywordsInput | string[]
    nameCheckApplicable?: BoolFieldUpdateOperationsInput | boolean
    isSingleCombinedUpload?: BoolFieldUpdateOperationsInput | boolean
    needsStampCheck?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentFieldUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    required?: BoolFieldUpdateOperationsInput | boolean
    maxAgeMonths?: NullableIntFieldUpdateOperationsInput | number | null
    expectedKeywords?: DocumentFieldUpdateexpectedKeywordsInput | string[]
    nameCheckApplicable?: BoolFieldUpdateOperationsInput | boolean
    isSingleCombinedUpload?: BoolFieldUpdateOperationsInput | boolean
    needsStampCheck?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BiodataFieldCreateInput = {
    id?: string
    key: string
    label: string
    tipe: string
    options?: BiodataFieldCreateoptionsInput | string[]
    required?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    program: ProgramBantuanCreateNestedOneWithoutBiodataFieldsInput
  }

  export type BiodataFieldUncheckedCreateInput = {
    id?: string
    programId: string
    key: string
    label: string
    tipe: string
    options?: BiodataFieldCreateoptionsInput | string[]
    required?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BiodataFieldUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    tipe?: StringFieldUpdateOperationsInput | string
    options?: BiodataFieldUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    program?: ProgramBantuanUpdateOneRequiredWithoutBiodataFieldsNestedInput
  }

  export type BiodataFieldUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    tipe?: StringFieldUpdateOperationsInput | string
    options?: BiodataFieldUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BiodataFieldCreateManyInput = {
    id?: string
    programId: string
    key: string
    label: string
    tipe: string
    options?: BiodataFieldCreateoptionsInput | string[]
    required?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BiodataFieldUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    tipe?: StringFieldUpdateOperationsInput | string
    options?: BiodataFieldUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BiodataFieldUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    tipe?: StringFieldUpdateOperationsInput | string
    options?: BiodataFieldUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionCreateInput = {
    id?: string
    token?: string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: string | null
    processingStartedAt?: Date | string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
    program: ProgramBantuanCreateNestedOneWithoutSubmissionsInput
    documents?: SubmissionDocumentCreateNestedManyWithoutSubmissionInput
  }

  export type SubmissionUncheckedCreateInput = {
    id?: string
    programId: string
    token?: string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: string | null
    processingStartedAt?: Date | string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
    documents?: SubmissionDocumentUncheckedCreateNestedManyWithoutSubmissionInput
  }

  export type SubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: NullableStringFieldUpdateOperationsInput | string | null
    processingStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    program?: ProgramBantuanUpdateOneRequiredWithoutSubmissionsNestedInput
    documents?: SubmissionDocumentUpdateManyWithoutSubmissionNestedInput
  }

  export type SubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: NullableStringFieldUpdateOperationsInput | string | null
    processingStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: SubmissionDocumentUncheckedUpdateManyWithoutSubmissionNestedInput
  }

  export type SubmissionCreateManyInput = {
    id?: string
    programId: string
    token?: string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: string | null
    processingStartedAt?: Date | string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: NullableStringFieldUpdateOperationsInput | string | null
    processingStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: NullableStringFieldUpdateOperationsInput | string | null
    processingStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionDocumentCreateInput = {
    id?: string
    fieldKey: string
    originalFilename: string
    fileUrl: string
    driveFileId?: string | null
    fileSizeBytes?: number | null
    mimeType?: string | null
    ocrText?: string | null
    needsRevision?: boolean
    revisionNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submission: SubmissionCreateNestedOneWithoutDocumentsInput
    documentField?: DocumentFieldCreateNestedOneWithoutDocumentsInput
  }

  export type SubmissionDocumentUncheckedCreateInput = {
    id?: string
    submissionId: string
    documentFieldId?: string | null
    fieldKey: string
    originalFilename: string
    fileUrl: string
    driveFileId?: string | null
    fileSizeBytes?: number | null
    mimeType?: string | null
    ocrText?: string | null
    needsRevision?: boolean
    revisionNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionDocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldKey?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    driveFileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileSizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    needsRevision?: BoolFieldUpdateOperationsInput | boolean
    revisionNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: SubmissionUpdateOneRequiredWithoutDocumentsNestedInput
    documentField?: DocumentFieldUpdateOneWithoutDocumentsNestedInput
  }

  export type SubmissionDocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    submissionId?: StringFieldUpdateOperationsInput | string
    documentFieldId?: NullableStringFieldUpdateOperationsInput | string | null
    fieldKey?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    driveFileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileSizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    needsRevision?: BoolFieldUpdateOperationsInput | boolean
    revisionNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionDocumentCreateManyInput = {
    id?: string
    submissionId: string
    documentFieldId?: string | null
    fieldKey: string
    originalFilename: string
    fileUrl: string
    driveFileId?: string | null
    fileSizeBytes?: number | null
    mimeType?: string | null
    ocrText?: string | null
    needsRevision?: boolean
    revisionNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionDocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldKey?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    driveFileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileSizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    needsRevision?: BoolFieldUpdateOperationsInput | boolean
    revisionNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionDocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    submissionId?: StringFieldUpdateOperationsInput | string
    documentFieldId?: NullableStringFieldUpdateOperationsInput | string | null
    fieldKey?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    driveFileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileSizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    needsRevision?: BoolFieldUpdateOperationsInput | boolean
    revisionNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DocumentFieldListRelationFilter = {
    every?: DocumentFieldWhereInput
    some?: DocumentFieldWhereInput
    none?: DocumentFieldWhereInput
  }

  export type BiodataFieldListRelationFilter = {
    every?: BiodataFieldWhereInput
    some?: BiodataFieldWhereInput
    none?: BiodataFieldWhereInput
  }

  export type SubmissionListRelationFilter = {
    every?: SubmissionWhereInput
    some?: SubmissionWhereInput
    none?: SubmissionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DocumentFieldOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BiodataFieldOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubmissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProgramBantuanCountOrderByAggregateInput = {
    id?: SortOrder
    nama?: SortOrder
    slug?: SortOrder
    deskripsi?: SortOrder
    gambarUrl?: SortOrder
    status?: SortOrder
    tanggalBuka?: SortOrder
    tanggalTutup?: SortOrder
    linkDriveTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramBantuanMaxOrderByAggregateInput = {
    id?: SortOrder
    nama?: SortOrder
    slug?: SortOrder
    deskripsi?: SortOrder
    gambarUrl?: SortOrder
    status?: SortOrder
    tanggalBuka?: SortOrder
    tanggalTutup?: SortOrder
    linkDriveTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramBantuanMinOrderByAggregateInput = {
    id?: SortOrder
    nama?: SortOrder
    slug?: SortOrder
    deskripsi?: SortOrder
    gambarUrl?: SortOrder
    status?: SortOrder
    tanggalBuka?: SortOrder
    tanggalTutup?: SortOrder
    linkDriveTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ProgramBantuanScalarRelationFilter = {
    is?: ProgramBantuanWhereInput
    isNot?: ProgramBantuanWhereInput
  }

  export type SubmissionDocumentListRelationFilter = {
    every?: SubmissionDocumentWhereInput
    some?: SubmissionDocumentWhereInput
    none?: SubmissionDocumentWhereInput
  }

  export type SubmissionDocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentFieldProgramIdKeyCompoundUniqueInput = {
    programId: string
    key: string
  }

  export type DocumentFieldCountOrderByAggregateInput = {
    id?: SortOrder
    programId?: SortOrder
    key?: SortOrder
    label?: SortOrder
    required?: SortOrder
    maxAgeMonths?: SortOrder
    expectedKeywords?: SortOrder
    nameCheckApplicable?: SortOrder
    isSingleCombinedUpload?: SortOrder
    needsStampCheck?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentFieldAvgOrderByAggregateInput = {
    maxAgeMonths?: SortOrder
    order?: SortOrder
  }

  export type DocumentFieldMaxOrderByAggregateInput = {
    id?: SortOrder
    programId?: SortOrder
    key?: SortOrder
    label?: SortOrder
    required?: SortOrder
    maxAgeMonths?: SortOrder
    nameCheckApplicable?: SortOrder
    isSingleCombinedUpload?: SortOrder
    needsStampCheck?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentFieldMinOrderByAggregateInput = {
    id?: SortOrder
    programId?: SortOrder
    key?: SortOrder
    label?: SortOrder
    required?: SortOrder
    maxAgeMonths?: SortOrder
    nameCheckApplicable?: SortOrder
    isSingleCombinedUpload?: SortOrder
    needsStampCheck?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentFieldSumOrderByAggregateInput = {
    maxAgeMonths?: SortOrder
    order?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BiodataFieldProgramIdKeyCompoundUniqueInput = {
    programId: string
    key: string
  }

  export type BiodataFieldCountOrderByAggregateInput = {
    id?: SortOrder
    programId?: SortOrder
    key?: SortOrder
    label?: SortOrder
    tipe?: SortOrder
    options?: SortOrder
    required?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BiodataFieldAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type BiodataFieldMaxOrderByAggregateInput = {
    id?: SortOrder
    programId?: SortOrder
    key?: SortOrder
    label?: SortOrder
    tipe?: SortOrder
    required?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BiodataFieldMinOrderByAggregateInput = {
    id?: SortOrder
    programId?: SortOrder
    key?: SortOrder
    label?: SortOrder
    tipe?: SortOrder
    required?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BiodataFieldSumOrderByAggregateInput = {
    order?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    programId?: SortOrder
    token?: SortOrder
    biodataValues?: SortOrder
    status?: SortOrder
    warnings?: SortOrder
    linkDokumenGabungan?: SortOrder
    processingStartedAt?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    programId?: SortOrder
    token?: SortOrder
    status?: SortOrder
    linkDokumenGabungan?: SortOrder
    processingStartedAt?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    programId?: SortOrder
    token?: SortOrder
    status?: SortOrder
    linkDokumenGabungan?: SortOrder
    processingStartedAt?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type SubmissionScalarRelationFilter = {
    is?: SubmissionWhereInput
    isNot?: SubmissionWhereInput
  }

  export type DocumentFieldNullableScalarRelationFilter = {
    is?: DocumentFieldWhereInput | null
    isNot?: DocumentFieldWhereInput | null
  }

  export type SubmissionDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    documentFieldId?: SortOrder
    fieldKey?: SortOrder
    originalFilename?: SortOrder
    fileUrl?: SortOrder
    driveFileId?: SortOrder
    fileSizeBytes?: SortOrder
    mimeType?: SortOrder
    ocrText?: SortOrder
    needsRevision?: SortOrder
    revisionNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubmissionDocumentAvgOrderByAggregateInput = {
    fileSizeBytes?: SortOrder
  }

  export type SubmissionDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    documentFieldId?: SortOrder
    fieldKey?: SortOrder
    originalFilename?: SortOrder
    fileUrl?: SortOrder
    driveFileId?: SortOrder
    fileSizeBytes?: SortOrder
    mimeType?: SortOrder
    ocrText?: SortOrder
    needsRevision?: SortOrder
    revisionNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubmissionDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    documentFieldId?: SortOrder
    fieldKey?: SortOrder
    originalFilename?: SortOrder
    fileUrl?: SortOrder
    driveFileId?: SortOrder
    fileSizeBytes?: SortOrder
    mimeType?: SortOrder
    ocrText?: SortOrder
    needsRevision?: SortOrder
    revisionNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubmissionDocumentSumOrderByAggregateInput = {
    fileSizeBytes?: SortOrder
  }

  export type DocumentFieldCreateNestedManyWithoutProgramInput = {
    create?: XOR<DocumentFieldCreateWithoutProgramInput, DocumentFieldUncheckedCreateWithoutProgramInput> | DocumentFieldCreateWithoutProgramInput[] | DocumentFieldUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: DocumentFieldCreateOrConnectWithoutProgramInput | DocumentFieldCreateOrConnectWithoutProgramInput[]
    createMany?: DocumentFieldCreateManyProgramInputEnvelope
    connect?: DocumentFieldWhereUniqueInput | DocumentFieldWhereUniqueInput[]
  }

  export type BiodataFieldCreateNestedManyWithoutProgramInput = {
    create?: XOR<BiodataFieldCreateWithoutProgramInput, BiodataFieldUncheckedCreateWithoutProgramInput> | BiodataFieldCreateWithoutProgramInput[] | BiodataFieldUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: BiodataFieldCreateOrConnectWithoutProgramInput | BiodataFieldCreateOrConnectWithoutProgramInput[]
    createMany?: BiodataFieldCreateManyProgramInputEnvelope
    connect?: BiodataFieldWhereUniqueInput | BiodataFieldWhereUniqueInput[]
  }

  export type SubmissionCreateNestedManyWithoutProgramInput = {
    create?: XOR<SubmissionCreateWithoutProgramInput, SubmissionUncheckedCreateWithoutProgramInput> | SubmissionCreateWithoutProgramInput[] | SubmissionUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: SubmissionCreateOrConnectWithoutProgramInput | SubmissionCreateOrConnectWithoutProgramInput[]
    createMany?: SubmissionCreateManyProgramInputEnvelope
    connect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
  }

  export type DocumentFieldUncheckedCreateNestedManyWithoutProgramInput = {
    create?: XOR<DocumentFieldCreateWithoutProgramInput, DocumentFieldUncheckedCreateWithoutProgramInput> | DocumentFieldCreateWithoutProgramInput[] | DocumentFieldUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: DocumentFieldCreateOrConnectWithoutProgramInput | DocumentFieldCreateOrConnectWithoutProgramInput[]
    createMany?: DocumentFieldCreateManyProgramInputEnvelope
    connect?: DocumentFieldWhereUniqueInput | DocumentFieldWhereUniqueInput[]
  }

  export type BiodataFieldUncheckedCreateNestedManyWithoutProgramInput = {
    create?: XOR<BiodataFieldCreateWithoutProgramInput, BiodataFieldUncheckedCreateWithoutProgramInput> | BiodataFieldCreateWithoutProgramInput[] | BiodataFieldUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: BiodataFieldCreateOrConnectWithoutProgramInput | BiodataFieldCreateOrConnectWithoutProgramInput[]
    createMany?: BiodataFieldCreateManyProgramInputEnvelope
    connect?: BiodataFieldWhereUniqueInput | BiodataFieldWhereUniqueInput[]
  }

  export type SubmissionUncheckedCreateNestedManyWithoutProgramInput = {
    create?: XOR<SubmissionCreateWithoutProgramInput, SubmissionUncheckedCreateWithoutProgramInput> | SubmissionCreateWithoutProgramInput[] | SubmissionUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: SubmissionCreateOrConnectWithoutProgramInput | SubmissionCreateOrConnectWithoutProgramInput[]
    createMany?: SubmissionCreateManyProgramInputEnvelope
    connect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DocumentFieldUpdateManyWithoutProgramNestedInput = {
    create?: XOR<DocumentFieldCreateWithoutProgramInput, DocumentFieldUncheckedCreateWithoutProgramInput> | DocumentFieldCreateWithoutProgramInput[] | DocumentFieldUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: DocumentFieldCreateOrConnectWithoutProgramInput | DocumentFieldCreateOrConnectWithoutProgramInput[]
    upsert?: DocumentFieldUpsertWithWhereUniqueWithoutProgramInput | DocumentFieldUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: DocumentFieldCreateManyProgramInputEnvelope
    set?: DocumentFieldWhereUniqueInput | DocumentFieldWhereUniqueInput[]
    disconnect?: DocumentFieldWhereUniqueInput | DocumentFieldWhereUniqueInput[]
    delete?: DocumentFieldWhereUniqueInput | DocumentFieldWhereUniqueInput[]
    connect?: DocumentFieldWhereUniqueInput | DocumentFieldWhereUniqueInput[]
    update?: DocumentFieldUpdateWithWhereUniqueWithoutProgramInput | DocumentFieldUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: DocumentFieldUpdateManyWithWhereWithoutProgramInput | DocumentFieldUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: DocumentFieldScalarWhereInput | DocumentFieldScalarWhereInput[]
  }

  export type BiodataFieldUpdateManyWithoutProgramNestedInput = {
    create?: XOR<BiodataFieldCreateWithoutProgramInput, BiodataFieldUncheckedCreateWithoutProgramInput> | BiodataFieldCreateWithoutProgramInput[] | BiodataFieldUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: BiodataFieldCreateOrConnectWithoutProgramInput | BiodataFieldCreateOrConnectWithoutProgramInput[]
    upsert?: BiodataFieldUpsertWithWhereUniqueWithoutProgramInput | BiodataFieldUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: BiodataFieldCreateManyProgramInputEnvelope
    set?: BiodataFieldWhereUniqueInput | BiodataFieldWhereUniqueInput[]
    disconnect?: BiodataFieldWhereUniqueInput | BiodataFieldWhereUniqueInput[]
    delete?: BiodataFieldWhereUniqueInput | BiodataFieldWhereUniqueInput[]
    connect?: BiodataFieldWhereUniqueInput | BiodataFieldWhereUniqueInput[]
    update?: BiodataFieldUpdateWithWhereUniqueWithoutProgramInput | BiodataFieldUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: BiodataFieldUpdateManyWithWhereWithoutProgramInput | BiodataFieldUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: BiodataFieldScalarWhereInput | BiodataFieldScalarWhereInput[]
  }

  export type SubmissionUpdateManyWithoutProgramNestedInput = {
    create?: XOR<SubmissionCreateWithoutProgramInput, SubmissionUncheckedCreateWithoutProgramInput> | SubmissionCreateWithoutProgramInput[] | SubmissionUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: SubmissionCreateOrConnectWithoutProgramInput | SubmissionCreateOrConnectWithoutProgramInput[]
    upsert?: SubmissionUpsertWithWhereUniqueWithoutProgramInput | SubmissionUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: SubmissionCreateManyProgramInputEnvelope
    set?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    disconnect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    delete?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    connect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    update?: SubmissionUpdateWithWhereUniqueWithoutProgramInput | SubmissionUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: SubmissionUpdateManyWithWhereWithoutProgramInput | SubmissionUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: SubmissionScalarWhereInput | SubmissionScalarWhereInput[]
  }

  export type DocumentFieldUncheckedUpdateManyWithoutProgramNestedInput = {
    create?: XOR<DocumentFieldCreateWithoutProgramInput, DocumentFieldUncheckedCreateWithoutProgramInput> | DocumentFieldCreateWithoutProgramInput[] | DocumentFieldUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: DocumentFieldCreateOrConnectWithoutProgramInput | DocumentFieldCreateOrConnectWithoutProgramInput[]
    upsert?: DocumentFieldUpsertWithWhereUniqueWithoutProgramInput | DocumentFieldUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: DocumentFieldCreateManyProgramInputEnvelope
    set?: DocumentFieldWhereUniqueInput | DocumentFieldWhereUniqueInput[]
    disconnect?: DocumentFieldWhereUniqueInput | DocumentFieldWhereUniqueInput[]
    delete?: DocumentFieldWhereUniqueInput | DocumentFieldWhereUniqueInput[]
    connect?: DocumentFieldWhereUniqueInput | DocumentFieldWhereUniqueInput[]
    update?: DocumentFieldUpdateWithWhereUniqueWithoutProgramInput | DocumentFieldUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: DocumentFieldUpdateManyWithWhereWithoutProgramInput | DocumentFieldUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: DocumentFieldScalarWhereInput | DocumentFieldScalarWhereInput[]
  }

  export type BiodataFieldUncheckedUpdateManyWithoutProgramNestedInput = {
    create?: XOR<BiodataFieldCreateWithoutProgramInput, BiodataFieldUncheckedCreateWithoutProgramInput> | BiodataFieldCreateWithoutProgramInput[] | BiodataFieldUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: BiodataFieldCreateOrConnectWithoutProgramInput | BiodataFieldCreateOrConnectWithoutProgramInput[]
    upsert?: BiodataFieldUpsertWithWhereUniqueWithoutProgramInput | BiodataFieldUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: BiodataFieldCreateManyProgramInputEnvelope
    set?: BiodataFieldWhereUniqueInput | BiodataFieldWhereUniqueInput[]
    disconnect?: BiodataFieldWhereUniqueInput | BiodataFieldWhereUniqueInput[]
    delete?: BiodataFieldWhereUniqueInput | BiodataFieldWhereUniqueInput[]
    connect?: BiodataFieldWhereUniqueInput | BiodataFieldWhereUniqueInput[]
    update?: BiodataFieldUpdateWithWhereUniqueWithoutProgramInput | BiodataFieldUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: BiodataFieldUpdateManyWithWhereWithoutProgramInput | BiodataFieldUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: BiodataFieldScalarWhereInput | BiodataFieldScalarWhereInput[]
  }

  export type SubmissionUncheckedUpdateManyWithoutProgramNestedInput = {
    create?: XOR<SubmissionCreateWithoutProgramInput, SubmissionUncheckedCreateWithoutProgramInput> | SubmissionCreateWithoutProgramInput[] | SubmissionUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: SubmissionCreateOrConnectWithoutProgramInput | SubmissionCreateOrConnectWithoutProgramInput[]
    upsert?: SubmissionUpsertWithWhereUniqueWithoutProgramInput | SubmissionUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: SubmissionCreateManyProgramInputEnvelope
    set?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    disconnect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    delete?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    connect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    update?: SubmissionUpdateWithWhereUniqueWithoutProgramInput | SubmissionUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: SubmissionUpdateManyWithWhereWithoutProgramInput | SubmissionUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: SubmissionScalarWhereInput | SubmissionScalarWhereInput[]
  }

  export type DocumentFieldCreateexpectedKeywordsInput = {
    set: string[]
  }

  export type ProgramBantuanCreateNestedOneWithoutDocumentFieldsInput = {
    create?: XOR<ProgramBantuanCreateWithoutDocumentFieldsInput, ProgramBantuanUncheckedCreateWithoutDocumentFieldsInput>
    connectOrCreate?: ProgramBantuanCreateOrConnectWithoutDocumentFieldsInput
    connect?: ProgramBantuanWhereUniqueInput
  }

  export type SubmissionDocumentCreateNestedManyWithoutDocumentFieldInput = {
    create?: XOR<SubmissionDocumentCreateWithoutDocumentFieldInput, SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput> | SubmissionDocumentCreateWithoutDocumentFieldInput[] | SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput[]
    connectOrCreate?: SubmissionDocumentCreateOrConnectWithoutDocumentFieldInput | SubmissionDocumentCreateOrConnectWithoutDocumentFieldInput[]
    createMany?: SubmissionDocumentCreateManyDocumentFieldInputEnvelope
    connect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
  }

  export type SubmissionDocumentUncheckedCreateNestedManyWithoutDocumentFieldInput = {
    create?: XOR<SubmissionDocumentCreateWithoutDocumentFieldInput, SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput> | SubmissionDocumentCreateWithoutDocumentFieldInput[] | SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput[]
    connectOrCreate?: SubmissionDocumentCreateOrConnectWithoutDocumentFieldInput | SubmissionDocumentCreateOrConnectWithoutDocumentFieldInput[]
    createMany?: SubmissionDocumentCreateManyDocumentFieldInputEnvelope
    connect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DocumentFieldUpdateexpectedKeywordsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProgramBantuanUpdateOneRequiredWithoutDocumentFieldsNestedInput = {
    create?: XOR<ProgramBantuanCreateWithoutDocumentFieldsInput, ProgramBantuanUncheckedCreateWithoutDocumentFieldsInput>
    connectOrCreate?: ProgramBantuanCreateOrConnectWithoutDocumentFieldsInput
    upsert?: ProgramBantuanUpsertWithoutDocumentFieldsInput
    connect?: ProgramBantuanWhereUniqueInput
    update?: XOR<XOR<ProgramBantuanUpdateToOneWithWhereWithoutDocumentFieldsInput, ProgramBantuanUpdateWithoutDocumentFieldsInput>, ProgramBantuanUncheckedUpdateWithoutDocumentFieldsInput>
  }

  export type SubmissionDocumentUpdateManyWithoutDocumentFieldNestedInput = {
    create?: XOR<SubmissionDocumentCreateWithoutDocumentFieldInput, SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput> | SubmissionDocumentCreateWithoutDocumentFieldInput[] | SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput[]
    connectOrCreate?: SubmissionDocumentCreateOrConnectWithoutDocumentFieldInput | SubmissionDocumentCreateOrConnectWithoutDocumentFieldInput[]
    upsert?: SubmissionDocumentUpsertWithWhereUniqueWithoutDocumentFieldInput | SubmissionDocumentUpsertWithWhereUniqueWithoutDocumentFieldInput[]
    createMany?: SubmissionDocumentCreateManyDocumentFieldInputEnvelope
    set?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    disconnect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    delete?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    connect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    update?: SubmissionDocumentUpdateWithWhereUniqueWithoutDocumentFieldInput | SubmissionDocumentUpdateWithWhereUniqueWithoutDocumentFieldInput[]
    updateMany?: SubmissionDocumentUpdateManyWithWhereWithoutDocumentFieldInput | SubmissionDocumentUpdateManyWithWhereWithoutDocumentFieldInput[]
    deleteMany?: SubmissionDocumentScalarWhereInput | SubmissionDocumentScalarWhereInput[]
  }

  export type SubmissionDocumentUncheckedUpdateManyWithoutDocumentFieldNestedInput = {
    create?: XOR<SubmissionDocumentCreateWithoutDocumentFieldInput, SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput> | SubmissionDocumentCreateWithoutDocumentFieldInput[] | SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput[]
    connectOrCreate?: SubmissionDocumentCreateOrConnectWithoutDocumentFieldInput | SubmissionDocumentCreateOrConnectWithoutDocumentFieldInput[]
    upsert?: SubmissionDocumentUpsertWithWhereUniqueWithoutDocumentFieldInput | SubmissionDocumentUpsertWithWhereUniqueWithoutDocumentFieldInput[]
    createMany?: SubmissionDocumentCreateManyDocumentFieldInputEnvelope
    set?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    disconnect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    delete?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    connect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    update?: SubmissionDocumentUpdateWithWhereUniqueWithoutDocumentFieldInput | SubmissionDocumentUpdateWithWhereUniqueWithoutDocumentFieldInput[]
    updateMany?: SubmissionDocumentUpdateManyWithWhereWithoutDocumentFieldInput | SubmissionDocumentUpdateManyWithWhereWithoutDocumentFieldInput[]
    deleteMany?: SubmissionDocumentScalarWhereInput | SubmissionDocumentScalarWhereInput[]
  }

  export type BiodataFieldCreateoptionsInput = {
    set: string[]
  }

  export type ProgramBantuanCreateNestedOneWithoutBiodataFieldsInput = {
    create?: XOR<ProgramBantuanCreateWithoutBiodataFieldsInput, ProgramBantuanUncheckedCreateWithoutBiodataFieldsInput>
    connectOrCreate?: ProgramBantuanCreateOrConnectWithoutBiodataFieldsInput
    connect?: ProgramBantuanWhereUniqueInput
  }

  export type BiodataFieldUpdateoptionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProgramBantuanUpdateOneRequiredWithoutBiodataFieldsNestedInput = {
    create?: XOR<ProgramBantuanCreateWithoutBiodataFieldsInput, ProgramBantuanUncheckedCreateWithoutBiodataFieldsInput>
    connectOrCreate?: ProgramBantuanCreateOrConnectWithoutBiodataFieldsInput
    upsert?: ProgramBantuanUpsertWithoutBiodataFieldsInput
    connect?: ProgramBantuanWhereUniqueInput
    update?: XOR<XOR<ProgramBantuanUpdateToOneWithWhereWithoutBiodataFieldsInput, ProgramBantuanUpdateWithoutBiodataFieldsInput>, ProgramBantuanUncheckedUpdateWithoutBiodataFieldsInput>
  }

  export type ProgramBantuanCreateNestedOneWithoutSubmissionsInput = {
    create?: XOR<ProgramBantuanCreateWithoutSubmissionsInput, ProgramBantuanUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: ProgramBantuanCreateOrConnectWithoutSubmissionsInput
    connect?: ProgramBantuanWhereUniqueInput
  }

  export type SubmissionDocumentCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<SubmissionDocumentCreateWithoutSubmissionInput, SubmissionDocumentUncheckedCreateWithoutSubmissionInput> | SubmissionDocumentCreateWithoutSubmissionInput[] | SubmissionDocumentUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: SubmissionDocumentCreateOrConnectWithoutSubmissionInput | SubmissionDocumentCreateOrConnectWithoutSubmissionInput[]
    createMany?: SubmissionDocumentCreateManySubmissionInputEnvelope
    connect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
  }

  export type SubmissionDocumentUncheckedCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<SubmissionDocumentCreateWithoutSubmissionInput, SubmissionDocumentUncheckedCreateWithoutSubmissionInput> | SubmissionDocumentCreateWithoutSubmissionInput[] | SubmissionDocumentUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: SubmissionDocumentCreateOrConnectWithoutSubmissionInput | SubmissionDocumentCreateOrConnectWithoutSubmissionInput[]
    createMany?: SubmissionDocumentCreateManySubmissionInputEnvelope
    connect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
  }

  export type ProgramBantuanUpdateOneRequiredWithoutSubmissionsNestedInput = {
    create?: XOR<ProgramBantuanCreateWithoutSubmissionsInput, ProgramBantuanUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: ProgramBantuanCreateOrConnectWithoutSubmissionsInput
    upsert?: ProgramBantuanUpsertWithoutSubmissionsInput
    connect?: ProgramBantuanWhereUniqueInput
    update?: XOR<XOR<ProgramBantuanUpdateToOneWithWhereWithoutSubmissionsInput, ProgramBantuanUpdateWithoutSubmissionsInput>, ProgramBantuanUncheckedUpdateWithoutSubmissionsInput>
  }

  export type SubmissionDocumentUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<SubmissionDocumentCreateWithoutSubmissionInput, SubmissionDocumentUncheckedCreateWithoutSubmissionInput> | SubmissionDocumentCreateWithoutSubmissionInput[] | SubmissionDocumentUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: SubmissionDocumentCreateOrConnectWithoutSubmissionInput | SubmissionDocumentCreateOrConnectWithoutSubmissionInput[]
    upsert?: SubmissionDocumentUpsertWithWhereUniqueWithoutSubmissionInput | SubmissionDocumentUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: SubmissionDocumentCreateManySubmissionInputEnvelope
    set?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    disconnect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    delete?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    connect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    update?: SubmissionDocumentUpdateWithWhereUniqueWithoutSubmissionInput | SubmissionDocumentUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: SubmissionDocumentUpdateManyWithWhereWithoutSubmissionInput | SubmissionDocumentUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: SubmissionDocumentScalarWhereInput | SubmissionDocumentScalarWhereInput[]
  }

  export type SubmissionDocumentUncheckedUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<SubmissionDocumentCreateWithoutSubmissionInput, SubmissionDocumentUncheckedCreateWithoutSubmissionInput> | SubmissionDocumentCreateWithoutSubmissionInput[] | SubmissionDocumentUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: SubmissionDocumentCreateOrConnectWithoutSubmissionInput | SubmissionDocumentCreateOrConnectWithoutSubmissionInput[]
    upsert?: SubmissionDocumentUpsertWithWhereUniqueWithoutSubmissionInput | SubmissionDocumentUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: SubmissionDocumentCreateManySubmissionInputEnvelope
    set?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    disconnect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    delete?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    connect?: SubmissionDocumentWhereUniqueInput | SubmissionDocumentWhereUniqueInput[]
    update?: SubmissionDocumentUpdateWithWhereUniqueWithoutSubmissionInput | SubmissionDocumentUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: SubmissionDocumentUpdateManyWithWhereWithoutSubmissionInput | SubmissionDocumentUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: SubmissionDocumentScalarWhereInput | SubmissionDocumentScalarWhereInput[]
  }

  export type SubmissionCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<SubmissionCreateWithoutDocumentsInput, SubmissionUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: SubmissionCreateOrConnectWithoutDocumentsInput
    connect?: SubmissionWhereUniqueInput
  }

  export type DocumentFieldCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<DocumentFieldCreateWithoutDocumentsInput, DocumentFieldUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: DocumentFieldCreateOrConnectWithoutDocumentsInput
    connect?: DocumentFieldWhereUniqueInput
  }

  export type SubmissionUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<SubmissionCreateWithoutDocumentsInput, SubmissionUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: SubmissionCreateOrConnectWithoutDocumentsInput
    upsert?: SubmissionUpsertWithoutDocumentsInput
    connect?: SubmissionWhereUniqueInput
    update?: XOR<XOR<SubmissionUpdateToOneWithWhereWithoutDocumentsInput, SubmissionUpdateWithoutDocumentsInput>, SubmissionUncheckedUpdateWithoutDocumentsInput>
  }

  export type DocumentFieldUpdateOneWithoutDocumentsNestedInput = {
    create?: XOR<DocumentFieldCreateWithoutDocumentsInput, DocumentFieldUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: DocumentFieldCreateOrConnectWithoutDocumentsInput
    upsert?: DocumentFieldUpsertWithoutDocumentsInput
    disconnect?: DocumentFieldWhereInput | boolean
    delete?: DocumentFieldWhereInput | boolean
    connect?: DocumentFieldWhereUniqueInput
    update?: XOR<XOR<DocumentFieldUpdateToOneWithWhereWithoutDocumentsInput, DocumentFieldUpdateWithoutDocumentsInput>, DocumentFieldUncheckedUpdateWithoutDocumentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DocumentFieldCreateWithoutProgramInput = {
    id?: string
    key: string
    label: string
    required?: boolean
    maxAgeMonths?: number | null
    expectedKeywords?: DocumentFieldCreateexpectedKeywordsInput | string[]
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: SubmissionDocumentCreateNestedManyWithoutDocumentFieldInput
  }

  export type DocumentFieldUncheckedCreateWithoutProgramInput = {
    id?: string
    key: string
    label: string
    required?: boolean
    maxAgeMonths?: number | null
    expectedKeywords?: DocumentFieldCreateexpectedKeywordsInput | string[]
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: SubmissionDocumentUncheckedCreateNestedManyWithoutDocumentFieldInput
  }

  export type DocumentFieldCreateOrConnectWithoutProgramInput = {
    where: DocumentFieldWhereUniqueInput
    create: XOR<DocumentFieldCreateWithoutProgramInput, DocumentFieldUncheckedCreateWithoutProgramInput>
  }

  export type DocumentFieldCreateManyProgramInputEnvelope = {
    data: DocumentFieldCreateManyProgramInput | DocumentFieldCreateManyProgramInput[]
    skipDuplicates?: boolean
  }

  export type BiodataFieldCreateWithoutProgramInput = {
    id?: string
    key: string
    label: string
    tipe: string
    options?: BiodataFieldCreateoptionsInput | string[]
    required?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BiodataFieldUncheckedCreateWithoutProgramInput = {
    id?: string
    key: string
    label: string
    tipe: string
    options?: BiodataFieldCreateoptionsInput | string[]
    required?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BiodataFieldCreateOrConnectWithoutProgramInput = {
    where: BiodataFieldWhereUniqueInput
    create: XOR<BiodataFieldCreateWithoutProgramInput, BiodataFieldUncheckedCreateWithoutProgramInput>
  }

  export type BiodataFieldCreateManyProgramInputEnvelope = {
    data: BiodataFieldCreateManyProgramInput | BiodataFieldCreateManyProgramInput[]
    skipDuplicates?: boolean
  }

  export type SubmissionCreateWithoutProgramInput = {
    id?: string
    token?: string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: string | null
    processingStartedAt?: Date | string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
    documents?: SubmissionDocumentCreateNestedManyWithoutSubmissionInput
  }

  export type SubmissionUncheckedCreateWithoutProgramInput = {
    id?: string
    token?: string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: string | null
    processingStartedAt?: Date | string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
    documents?: SubmissionDocumentUncheckedCreateNestedManyWithoutSubmissionInput
  }

  export type SubmissionCreateOrConnectWithoutProgramInput = {
    where: SubmissionWhereUniqueInput
    create: XOR<SubmissionCreateWithoutProgramInput, SubmissionUncheckedCreateWithoutProgramInput>
  }

  export type SubmissionCreateManyProgramInputEnvelope = {
    data: SubmissionCreateManyProgramInput | SubmissionCreateManyProgramInput[]
    skipDuplicates?: boolean
  }

  export type DocumentFieldUpsertWithWhereUniqueWithoutProgramInput = {
    where: DocumentFieldWhereUniqueInput
    update: XOR<DocumentFieldUpdateWithoutProgramInput, DocumentFieldUncheckedUpdateWithoutProgramInput>
    create: XOR<DocumentFieldCreateWithoutProgramInput, DocumentFieldUncheckedCreateWithoutProgramInput>
  }

  export type DocumentFieldUpdateWithWhereUniqueWithoutProgramInput = {
    where: DocumentFieldWhereUniqueInput
    data: XOR<DocumentFieldUpdateWithoutProgramInput, DocumentFieldUncheckedUpdateWithoutProgramInput>
  }

  export type DocumentFieldUpdateManyWithWhereWithoutProgramInput = {
    where: DocumentFieldScalarWhereInput
    data: XOR<DocumentFieldUpdateManyMutationInput, DocumentFieldUncheckedUpdateManyWithoutProgramInput>
  }

  export type DocumentFieldScalarWhereInput = {
    AND?: DocumentFieldScalarWhereInput | DocumentFieldScalarWhereInput[]
    OR?: DocumentFieldScalarWhereInput[]
    NOT?: DocumentFieldScalarWhereInput | DocumentFieldScalarWhereInput[]
    id?: StringFilter<"DocumentField"> | string
    programId?: StringFilter<"DocumentField"> | string
    key?: StringFilter<"DocumentField"> | string
    label?: StringFilter<"DocumentField"> | string
    required?: BoolFilter<"DocumentField"> | boolean
    maxAgeMonths?: IntNullableFilter<"DocumentField"> | number | null
    expectedKeywords?: StringNullableListFilter<"DocumentField">
    nameCheckApplicable?: BoolFilter<"DocumentField"> | boolean
    isSingleCombinedUpload?: BoolFilter<"DocumentField"> | boolean
    needsStampCheck?: BoolFilter<"DocumentField"> | boolean
    order?: IntFilter<"DocumentField"> | number
    createdAt?: DateTimeFilter<"DocumentField"> | Date | string
    updatedAt?: DateTimeFilter<"DocumentField"> | Date | string
  }

  export type BiodataFieldUpsertWithWhereUniqueWithoutProgramInput = {
    where: BiodataFieldWhereUniqueInput
    update: XOR<BiodataFieldUpdateWithoutProgramInput, BiodataFieldUncheckedUpdateWithoutProgramInput>
    create: XOR<BiodataFieldCreateWithoutProgramInput, BiodataFieldUncheckedCreateWithoutProgramInput>
  }

  export type BiodataFieldUpdateWithWhereUniqueWithoutProgramInput = {
    where: BiodataFieldWhereUniqueInput
    data: XOR<BiodataFieldUpdateWithoutProgramInput, BiodataFieldUncheckedUpdateWithoutProgramInput>
  }

  export type BiodataFieldUpdateManyWithWhereWithoutProgramInput = {
    where: BiodataFieldScalarWhereInput
    data: XOR<BiodataFieldUpdateManyMutationInput, BiodataFieldUncheckedUpdateManyWithoutProgramInput>
  }

  export type BiodataFieldScalarWhereInput = {
    AND?: BiodataFieldScalarWhereInput | BiodataFieldScalarWhereInput[]
    OR?: BiodataFieldScalarWhereInput[]
    NOT?: BiodataFieldScalarWhereInput | BiodataFieldScalarWhereInput[]
    id?: StringFilter<"BiodataField"> | string
    programId?: StringFilter<"BiodataField"> | string
    key?: StringFilter<"BiodataField"> | string
    label?: StringFilter<"BiodataField"> | string
    tipe?: StringFilter<"BiodataField"> | string
    options?: StringNullableListFilter<"BiodataField">
    required?: BoolFilter<"BiodataField"> | boolean
    order?: IntFilter<"BiodataField"> | number
    createdAt?: DateTimeFilter<"BiodataField"> | Date | string
    updatedAt?: DateTimeFilter<"BiodataField"> | Date | string
  }

  export type SubmissionUpsertWithWhereUniqueWithoutProgramInput = {
    where: SubmissionWhereUniqueInput
    update: XOR<SubmissionUpdateWithoutProgramInput, SubmissionUncheckedUpdateWithoutProgramInput>
    create: XOR<SubmissionCreateWithoutProgramInput, SubmissionUncheckedCreateWithoutProgramInput>
  }

  export type SubmissionUpdateWithWhereUniqueWithoutProgramInput = {
    where: SubmissionWhereUniqueInput
    data: XOR<SubmissionUpdateWithoutProgramInput, SubmissionUncheckedUpdateWithoutProgramInput>
  }

  export type SubmissionUpdateManyWithWhereWithoutProgramInput = {
    where: SubmissionScalarWhereInput
    data: XOR<SubmissionUpdateManyMutationInput, SubmissionUncheckedUpdateManyWithoutProgramInput>
  }

  export type SubmissionScalarWhereInput = {
    AND?: SubmissionScalarWhereInput | SubmissionScalarWhereInput[]
    OR?: SubmissionScalarWhereInput[]
    NOT?: SubmissionScalarWhereInput | SubmissionScalarWhereInput[]
    id?: StringFilter<"Submission"> | string
    programId?: StringFilter<"Submission"> | string
    token?: StringFilter<"Submission"> | string
    biodataValues?: JsonFilter<"Submission">
    status?: StringFilter<"Submission"> | string
    warnings?: JsonFilter<"Submission">
    linkDokumenGabungan?: StringNullableFilter<"Submission"> | string | null
    processingStartedAt?: DateTimeNullableFilter<"Submission"> | Date | string | null
    submittedAt?: DateTimeFilter<"Submission"> | Date | string
    updatedAt?: DateTimeFilter<"Submission"> | Date | string
  }

  export type ProgramBantuanCreateWithoutDocumentFieldsInput = {
    id?: string
    nama: string
    slug: string
    deskripsi?: string | null
    gambarUrl?: string | null
    status?: string
    tanggalBuka?: Date | string | null
    tanggalTutup?: Date | string | null
    linkDriveTemplate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    biodataFields?: BiodataFieldCreateNestedManyWithoutProgramInput
    submissions?: SubmissionCreateNestedManyWithoutProgramInput
  }

  export type ProgramBantuanUncheckedCreateWithoutDocumentFieldsInput = {
    id?: string
    nama: string
    slug: string
    deskripsi?: string | null
    gambarUrl?: string | null
    status?: string
    tanggalBuka?: Date | string | null
    tanggalTutup?: Date | string | null
    linkDriveTemplate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    biodataFields?: BiodataFieldUncheckedCreateNestedManyWithoutProgramInput
    submissions?: SubmissionUncheckedCreateNestedManyWithoutProgramInput
  }

  export type ProgramBantuanCreateOrConnectWithoutDocumentFieldsInput = {
    where: ProgramBantuanWhereUniqueInput
    create: XOR<ProgramBantuanCreateWithoutDocumentFieldsInput, ProgramBantuanUncheckedCreateWithoutDocumentFieldsInput>
  }

  export type SubmissionDocumentCreateWithoutDocumentFieldInput = {
    id?: string
    fieldKey: string
    originalFilename: string
    fileUrl: string
    driveFileId?: string | null
    fileSizeBytes?: number | null
    mimeType?: string | null
    ocrText?: string | null
    needsRevision?: boolean
    revisionNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submission: SubmissionCreateNestedOneWithoutDocumentsInput
  }

  export type SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput = {
    id?: string
    submissionId: string
    fieldKey: string
    originalFilename: string
    fileUrl: string
    driveFileId?: string | null
    fileSizeBytes?: number | null
    mimeType?: string | null
    ocrText?: string | null
    needsRevision?: boolean
    revisionNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionDocumentCreateOrConnectWithoutDocumentFieldInput = {
    where: SubmissionDocumentWhereUniqueInput
    create: XOR<SubmissionDocumentCreateWithoutDocumentFieldInput, SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput>
  }

  export type SubmissionDocumentCreateManyDocumentFieldInputEnvelope = {
    data: SubmissionDocumentCreateManyDocumentFieldInput | SubmissionDocumentCreateManyDocumentFieldInput[]
    skipDuplicates?: boolean
  }

  export type ProgramBantuanUpsertWithoutDocumentFieldsInput = {
    update: XOR<ProgramBantuanUpdateWithoutDocumentFieldsInput, ProgramBantuanUncheckedUpdateWithoutDocumentFieldsInput>
    create: XOR<ProgramBantuanCreateWithoutDocumentFieldsInput, ProgramBantuanUncheckedCreateWithoutDocumentFieldsInput>
    where?: ProgramBantuanWhereInput
  }

  export type ProgramBantuanUpdateToOneWithWhereWithoutDocumentFieldsInput = {
    where?: ProgramBantuanWhereInput
    data: XOR<ProgramBantuanUpdateWithoutDocumentFieldsInput, ProgramBantuanUncheckedUpdateWithoutDocumentFieldsInput>
  }

  export type ProgramBantuanUpdateWithoutDocumentFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    deskripsi?: NullableStringFieldUpdateOperationsInput | string | null
    gambarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tanggalBuka?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalTutup?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkDriveTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    biodataFields?: BiodataFieldUpdateManyWithoutProgramNestedInput
    submissions?: SubmissionUpdateManyWithoutProgramNestedInput
  }

  export type ProgramBantuanUncheckedUpdateWithoutDocumentFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    deskripsi?: NullableStringFieldUpdateOperationsInput | string | null
    gambarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tanggalBuka?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalTutup?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkDriveTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    biodataFields?: BiodataFieldUncheckedUpdateManyWithoutProgramNestedInput
    submissions?: SubmissionUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type SubmissionDocumentUpsertWithWhereUniqueWithoutDocumentFieldInput = {
    where: SubmissionDocumentWhereUniqueInput
    update: XOR<SubmissionDocumentUpdateWithoutDocumentFieldInput, SubmissionDocumentUncheckedUpdateWithoutDocumentFieldInput>
    create: XOR<SubmissionDocumentCreateWithoutDocumentFieldInput, SubmissionDocumentUncheckedCreateWithoutDocumentFieldInput>
  }

  export type SubmissionDocumentUpdateWithWhereUniqueWithoutDocumentFieldInput = {
    where: SubmissionDocumentWhereUniqueInput
    data: XOR<SubmissionDocumentUpdateWithoutDocumentFieldInput, SubmissionDocumentUncheckedUpdateWithoutDocumentFieldInput>
  }

  export type SubmissionDocumentUpdateManyWithWhereWithoutDocumentFieldInput = {
    where: SubmissionDocumentScalarWhereInput
    data: XOR<SubmissionDocumentUpdateManyMutationInput, SubmissionDocumentUncheckedUpdateManyWithoutDocumentFieldInput>
  }

  export type SubmissionDocumentScalarWhereInput = {
    AND?: SubmissionDocumentScalarWhereInput | SubmissionDocumentScalarWhereInput[]
    OR?: SubmissionDocumentScalarWhereInput[]
    NOT?: SubmissionDocumentScalarWhereInput | SubmissionDocumentScalarWhereInput[]
    id?: StringFilter<"SubmissionDocument"> | string
    submissionId?: StringFilter<"SubmissionDocument"> | string
    documentFieldId?: StringNullableFilter<"SubmissionDocument"> | string | null
    fieldKey?: StringFilter<"SubmissionDocument"> | string
    originalFilename?: StringFilter<"SubmissionDocument"> | string
    fileUrl?: StringFilter<"SubmissionDocument"> | string
    driveFileId?: StringNullableFilter<"SubmissionDocument"> | string | null
    fileSizeBytes?: IntNullableFilter<"SubmissionDocument"> | number | null
    mimeType?: StringNullableFilter<"SubmissionDocument"> | string | null
    ocrText?: StringNullableFilter<"SubmissionDocument"> | string | null
    needsRevision?: BoolFilter<"SubmissionDocument"> | boolean
    revisionNote?: StringNullableFilter<"SubmissionDocument"> | string | null
    createdAt?: DateTimeFilter<"SubmissionDocument"> | Date | string
    updatedAt?: DateTimeFilter<"SubmissionDocument"> | Date | string
  }

  export type ProgramBantuanCreateWithoutBiodataFieldsInput = {
    id?: string
    nama: string
    slug: string
    deskripsi?: string | null
    gambarUrl?: string | null
    status?: string
    tanggalBuka?: Date | string | null
    tanggalTutup?: Date | string | null
    linkDriveTemplate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documentFields?: DocumentFieldCreateNestedManyWithoutProgramInput
    submissions?: SubmissionCreateNestedManyWithoutProgramInput
  }

  export type ProgramBantuanUncheckedCreateWithoutBiodataFieldsInput = {
    id?: string
    nama: string
    slug: string
    deskripsi?: string | null
    gambarUrl?: string | null
    status?: string
    tanggalBuka?: Date | string | null
    tanggalTutup?: Date | string | null
    linkDriveTemplate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documentFields?: DocumentFieldUncheckedCreateNestedManyWithoutProgramInput
    submissions?: SubmissionUncheckedCreateNestedManyWithoutProgramInput
  }

  export type ProgramBantuanCreateOrConnectWithoutBiodataFieldsInput = {
    where: ProgramBantuanWhereUniqueInput
    create: XOR<ProgramBantuanCreateWithoutBiodataFieldsInput, ProgramBantuanUncheckedCreateWithoutBiodataFieldsInput>
  }

  export type ProgramBantuanUpsertWithoutBiodataFieldsInput = {
    update: XOR<ProgramBantuanUpdateWithoutBiodataFieldsInput, ProgramBantuanUncheckedUpdateWithoutBiodataFieldsInput>
    create: XOR<ProgramBantuanCreateWithoutBiodataFieldsInput, ProgramBantuanUncheckedCreateWithoutBiodataFieldsInput>
    where?: ProgramBantuanWhereInput
  }

  export type ProgramBantuanUpdateToOneWithWhereWithoutBiodataFieldsInput = {
    where?: ProgramBantuanWhereInput
    data: XOR<ProgramBantuanUpdateWithoutBiodataFieldsInput, ProgramBantuanUncheckedUpdateWithoutBiodataFieldsInput>
  }

  export type ProgramBantuanUpdateWithoutBiodataFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    deskripsi?: NullableStringFieldUpdateOperationsInput | string | null
    gambarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tanggalBuka?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalTutup?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkDriveTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documentFields?: DocumentFieldUpdateManyWithoutProgramNestedInput
    submissions?: SubmissionUpdateManyWithoutProgramNestedInput
  }

  export type ProgramBantuanUncheckedUpdateWithoutBiodataFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    deskripsi?: NullableStringFieldUpdateOperationsInput | string | null
    gambarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tanggalBuka?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalTutup?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkDriveTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documentFields?: DocumentFieldUncheckedUpdateManyWithoutProgramNestedInput
    submissions?: SubmissionUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type ProgramBantuanCreateWithoutSubmissionsInput = {
    id?: string
    nama: string
    slug: string
    deskripsi?: string | null
    gambarUrl?: string | null
    status?: string
    tanggalBuka?: Date | string | null
    tanggalTutup?: Date | string | null
    linkDriveTemplate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documentFields?: DocumentFieldCreateNestedManyWithoutProgramInput
    biodataFields?: BiodataFieldCreateNestedManyWithoutProgramInput
  }

  export type ProgramBantuanUncheckedCreateWithoutSubmissionsInput = {
    id?: string
    nama: string
    slug: string
    deskripsi?: string | null
    gambarUrl?: string | null
    status?: string
    tanggalBuka?: Date | string | null
    tanggalTutup?: Date | string | null
    linkDriveTemplate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documentFields?: DocumentFieldUncheckedCreateNestedManyWithoutProgramInput
    biodataFields?: BiodataFieldUncheckedCreateNestedManyWithoutProgramInput
  }

  export type ProgramBantuanCreateOrConnectWithoutSubmissionsInput = {
    where: ProgramBantuanWhereUniqueInput
    create: XOR<ProgramBantuanCreateWithoutSubmissionsInput, ProgramBantuanUncheckedCreateWithoutSubmissionsInput>
  }

  export type SubmissionDocumentCreateWithoutSubmissionInput = {
    id?: string
    fieldKey: string
    originalFilename: string
    fileUrl: string
    driveFileId?: string | null
    fileSizeBytes?: number | null
    mimeType?: string | null
    ocrText?: string | null
    needsRevision?: boolean
    revisionNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documentField?: DocumentFieldCreateNestedOneWithoutDocumentsInput
  }

  export type SubmissionDocumentUncheckedCreateWithoutSubmissionInput = {
    id?: string
    documentFieldId?: string | null
    fieldKey: string
    originalFilename: string
    fileUrl: string
    driveFileId?: string | null
    fileSizeBytes?: number | null
    mimeType?: string | null
    ocrText?: string | null
    needsRevision?: boolean
    revisionNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionDocumentCreateOrConnectWithoutSubmissionInput = {
    where: SubmissionDocumentWhereUniqueInput
    create: XOR<SubmissionDocumentCreateWithoutSubmissionInput, SubmissionDocumentUncheckedCreateWithoutSubmissionInput>
  }

  export type SubmissionDocumentCreateManySubmissionInputEnvelope = {
    data: SubmissionDocumentCreateManySubmissionInput | SubmissionDocumentCreateManySubmissionInput[]
    skipDuplicates?: boolean
  }

  export type ProgramBantuanUpsertWithoutSubmissionsInput = {
    update: XOR<ProgramBantuanUpdateWithoutSubmissionsInput, ProgramBantuanUncheckedUpdateWithoutSubmissionsInput>
    create: XOR<ProgramBantuanCreateWithoutSubmissionsInput, ProgramBantuanUncheckedCreateWithoutSubmissionsInput>
    where?: ProgramBantuanWhereInput
  }

  export type ProgramBantuanUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: ProgramBantuanWhereInput
    data: XOR<ProgramBantuanUpdateWithoutSubmissionsInput, ProgramBantuanUncheckedUpdateWithoutSubmissionsInput>
  }

  export type ProgramBantuanUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    deskripsi?: NullableStringFieldUpdateOperationsInput | string | null
    gambarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tanggalBuka?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalTutup?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkDriveTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documentFields?: DocumentFieldUpdateManyWithoutProgramNestedInput
    biodataFields?: BiodataFieldUpdateManyWithoutProgramNestedInput
  }

  export type ProgramBantuanUncheckedUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    deskripsi?: NullableStringFieldUpdateOperationsInput | string | null
    gambarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tanggalBuka?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggalTutup?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkDriveTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documentFields?: DocumentFieldUncheckedUpdateManyWithoutProgramNestedInput
    biodataFields?: BiodataFieldUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type SubmissionDocumentUpsertWithWhereUniqueWithoutSubmissionInput = {
    where: SubmissionDocumentWhereUniqueInput
    update: XOR<SubmissionDocumentUpdateWithoutSubmissionInput, SubmissionDocumentUncheckedUpdateWithoutSubmissionInput>
    create: XOR<SubmissionDocumentCreateWithoutSubmissionInput, SubmissionDocumentUncheckedCreateWithoutSubmissionInput>
  }

  export type SubmissionDocumentUpdateWithWhereUniqueWithoutSubmissionInput = {
    where: SubmissionDocumentWhereUniqueInput
    data: XOR<SubmissionDocumentUpdateWithoutSubmissionInput, SubmissionDocumentUncheckedUpdateWithoutSubmissionInput>
  }

  export type SubmissionDocumentUpdateManyWithWhereWithoutSubmissionInput = {
    where: SubmissionDocumentScalarWhereInput
    data: XOR<SubmissionDocumentUpdateManyMutationInput, SubmissionDocumentUncheckedUpdateManyWithoutSubmissionInput>
  }

  export type SubmissionCreateWithoutDocumentsInput = {
    id?: string
    token?: string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: string | null
    processingStartedAt?: Date | string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
    program: ProgramBantuanCreateNestedOneWithoutSubmissionsInput
  }

  export type SubmissionUncheckedCreateWithoutDocumentsInput = {
    id?: string
    programId: string
    token?: string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: string | null
    processingStartedAt?: Date | string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionCreateOrConnectWithoutDocumentsInput = {
    where: SubmissionWhereUniqueInput
    create: XOR<SubmissionCreateWithoutDocumentsInput, SubmissionUncheckedCreateWithoutDocumentsInput>
  }

  export type DocumentFieldCreateWithoutDocumentsInput = {
    id?: string
    key: string
    label: string
    required?: boolean
    maxAgeMonths?: number | null
    expectedKeywords?: DocumentFieldCreateexpectedKeywordsInput | string[]
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    program: ProgramBantuanCreateNestedOneWithoutDocumentFieldsInput
  }

  export type DocumentFieldUncheckedCreateWithoutDocumentsInput = {
    id?: string
    programId: string
    key: string
    label: string
    required?: boolean
    maxAgeMonths?: number | null
    expectedKeywords?: DocumentFieldCreateexpectedKeywordsInput | string[]
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentFieldCreateOrConnectWithoutDocumentsInput = {
    where: DocumentFieldWhereUniqueInput
    create: XOR<DocumentFieldCreateWithoutDocumentsInput, DocumentFieldUncheckedCreateWithoutDocumentsInput>
  }

  export type SubmissionUpsertWithoutDocumentsInput = {
    update: XOR<SubmissionUpdateWithoutDocumentsInput, SubmissionUncheckedUpdateWithoutDocumentsInput>
    create: XOR<SubmissionCreateWithoutDocumentsInput, SubmissionUncheckedCreateWithoutDocumentsInput>
    where?: SubmissionWhereInput
  }

  export type SubmissionUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: SubmissionWhereInput
    data: XOR<SubmissionUpdateWithoutDocumentsInput, SubmissionUncheckedUpdateWithoutDocumentsInput>
  }

  export type SubmissionUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: NullableStringFieldUpdateOperationsInput | string | null
    processingStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    program?: ProgramBantuanUpdateOneRequiredWithoutSubmissionsNestedInput
  }

  export type SubmissionUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: NullableStringFieldUpdateOperationsInput | string | null
    processingStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentFieldUpsertWithoutDocumentsInput = {
    update: XOR<DocumentFieldUpdateWithoutDocumentsInput, DocumentFieldUncheckedUpdateWithoutDocumentsInput>
    create: XOR<DocumentFieldCreateWithoutDocumentsInput, DocumentFieldUncheckedCreateWithoutDocumentsInput>
    where?: DocumentFieldWhereInput
  }

  export type DocumentFieldUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: DocumentFieldWhereInput
    data: XOR<DocumentFieldUpdateWithoutDocumentsInput, DocumentFieldUncheckedUpdateWithoutDocumentsInput>
  }

  export type DocumentFieldUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    required?: BoolFieldUpdateOperationsInput | boolean
    maxAgeMonths?: NullableIntFieldUpdateOperationsInput | number | null
    expectedKeywords?: DocumentFieldUpdateexpectedKeywordsInput | string[]
    nameCheckApplicable?: BoolFieldUpdateOperationsInput | boolean
    isSingleCombinedUpload?: BoolFieldUpdateOperationsInput | boolean
    needsStampCheck?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    program?: ProgramBantuanUpdateOneRequiredWithoutDocumentFieldsNestedInput
  }

  export type DocumentFieldUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    required?: BoolFieldUpdateOperationsInput | boolean
    maxAgeMonths?: NullableIntFieldUpdateOperationsInput | number | null
    expectedKeywords?: DocumentFieldUpdateexpectedKeywordsInput | string[]
    nameCheckApplicable?: BoolFieldUpdateOperationsInput | boolean
    isSingleCombinedUpload?: BoolFieldUpdateOperationsInput | boolean
    needsStampCheck?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentFieldCreateManyProgramInput = {
    id?: string
    key: string
    label: string
    required?: boolean
    maxAgeMonths?: number | null
    expectedKeywords?: DocumentFieldCreateexpectedKeywordsInput | string[]
    nameCheckApplicable?: boolean
    isSingleCombinedUpload?: boolean
    needsStampCheck?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BiodataFieldCreateManyProgramInput = {
    id?: string
    key: string
    label: string
    tipe: string
    options?: BiodataFieldCreateoptionsInput | string[]
    required?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionCreateManyProgramInput = {
    id?: string
    token?: string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: string | null
    processingStartedAt?: Date | string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentFieldUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    required?: BoolFieldUpdateOperationsInput | boolean
    maxAgeMonths?: NullableIntFieldUpdateOperationsInput | number | null
    expectedKeywords?: DocumentFieldUpdateexpectedKeywordsInput | string[]
    nameCheckApplicable?: BoolFieldUpdateOperationsInput | boolean
    isSingleCombinedUpload?: BoolFieldUpdateOperationsInput | boolean
    needsStampCheck?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: SubmissionDocumentUpdateManyWithoutDocumentFieldNestedInput
  }

  export type DocumentFieldUncheckedUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    required?: BoolFieldUpdateOperationsInput | boolean
    maxAgeMonths?: NullableIntFieldUpdateOperationsInput | number | null
    expectedKeywords?: DocumentFieldUpdateexpectedKeywordsInput | string[]
    nameCheckApplicable?: BoolFieldUpdateOperationsInput | boolean
    isSingleCombinedUpload?: BoolFieldUpdateOperationsInput | boolean
    needsStampCheck?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: SubmissionDocumentUncheckedUpdateManyWithoutDocumentFieldNestedInput
  }

  export type DocumentFieldUncheckedUpdateManyWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    required?: BoolFieldUpdateOperationsInput | boolean
    maxAgeMonths?: NullableIntFieldUpdateOperationsInput | number | null
    expectedKeywords?: DocumentFieldUpdateexpectedKeywordsInput | string[]
    nameCheckApplicable?: BoolFieldUpdateOperationsInput | boolean
    isSingleCombinedUpload?: BoolFieldUpdateOperationsInput | boolean
    needsStampCheck?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BiodataFieldUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    tipe?: StringFieldUpdateOperationsInput | string
    options?: BiodataFieldUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BiodataFieldUncheckedUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    tipe?: StringFieldUpdateOperationsInput | string
    options?: BiodataFieldUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BiodataFieldUncheckedUpdateManyWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    tipe?: StringFieldUpdateOperationsInput | string
    options?: BiodataFieldUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: NullableStringFieldUpdateOperationsInput | string | null
    processingStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: SubmissionDocumentUpdateManyWithoutSubmissionNestedInput
  }

  export type SubmissionUncheckedUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: NullableStringFieldUpdateOperationsInput | string | null
    processingStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: SubmissionDocumentUncheckedUpdateManyWithoutSubmissionNestedInput
  }

  export type SubmissionUncheckedUpdateManyWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    biodataValues?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    warnings?: JsonNullValueInput | InputJsonValue
    linkDokumenGabungan?: NullableStringFieldUpdateOperationsInput | string | null
    processingStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionDocumentCreateManyDocumentFieldInput = {
    id?: string
    submissionId: string
    fieldKey: string
    originalFilename: string
    fileUrl: string
    driveFileId?: string | null
    fileSizeBytes?: number | null
    mimeType?: string | null
    ocrText?: string | null
    needsRevision?: boolean
    revisionNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionDocumentUpdateWithoutDocumentFieldInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldKey?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    driveFileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileSizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    needsRevision?: BoolFieldUpdateOperationsInput | boolean
    revisionNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: SubmissionUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type SubmissionDocumentUncheckedUpdateWithoutDocumentFieldInput = {
    id?: StringFieldUpdateOperationsInput | string
    submissionId?: StringFieldUpdateOperationsInput | string
    fieldKey?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    driveFileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileSizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    needsRevision?: BoolFieldUpdateOperationsInput | boolean
    revisionNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionDocumentUncheckedUpdateManyWithoutDocumentFieldInput = {
    id?: StringFieldUpdateOperationsInput | string
    submissionId?: StringFieldUpdateOperationsInput | string
    fieldKey?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    driveFileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileSizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    needsRevision?: BoolFieldUpdateOperationsInput | boolean
    revisionNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionDocumentCreateManySubmissionInput = {
    id?: string
    documentFieldId?: string | null
    fieldKey: string
    originalFilename: string
    fileUrl: string
    driveFileId?: string | null
    fileSizeBytes?: number | null
    mimeType?: string | null
    ocrText?: string | null
    needsRevision?: boolean
    revisionNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionDocumentUpdateWithoutSubmissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldKey?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    driveFileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileSizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    needsRevision?: BoolFieldUpdateOperationsInput | boolean
    revisionNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documentField?: DocumentFieldUpdateOneWithoutDocumentsNestedInput
  }

  export type SubmissionDocumentUncheckedUpdateWithoutSubmissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentFieldId?: NullableStringFieldUpdateOperationsInput | string | null
    fieldKey?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    driveFileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileSizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    needsRevision?: BoolFieldUpdateOperationsInput | boolean
    revisionNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionDocumentUncheckedUpdateManyWithoutSubmissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentFieldId?: NullableStringFieldUpdateOperationsInput | string | null
    fieldKey?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    driveFileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileSizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    needsRevision?: BoolFieldUpdateOperationsInput | boolean
    revisionNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}