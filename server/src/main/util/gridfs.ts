import { Injectable } from '@rester/core';
import { ReadStream, WriteStream } from 'fs';
import { GridFSBucket, MongoClient } from 'mongodb';
import { getConnection, ObjectID } from 'typeorm';

export interface BucketOption {
  bucketName: string;
  filename: string;
}

@Injectable()
export class GridFS {

  public mongo!: MongoClient;
  public buckets: { [index: string]: GridFSBucket; } = {};

  constructor() { }

  init() {
    if (this.mongo) { return; }
    this.mongo = (getConnection().driver as any)
      .queryRunner
      .databaseConnection;
    const db = this.mongo.db('aria2one');
    this.buckets.image = new GridFSBucket(db, { bucketName: 'image' });
    this.buckets.video = new GridFSBucket(db, { bucketName: 'video' });
    this.buckets.audio = new GridFSBucket(db, { bucketName: 'audio' });
    this.buckets.file = new GridFSBucket(db, { bucketName: 'file' });
  }

  upload(
    stream: ReadStream,
    filename: string,
    bucketName: 'image' | 'video' | 'audio' | 'file' = 'file'
  ): Promise<void> {
    if (!this.buckets[bucketName]) {
      throw new Error(`bucket ${bucketName} not found`);
    }
    return new Promise((res, rej) => stream
      .pipe(this.buckets[bucketName].openUploadStream(filename))
      .on('error', e => rej(e))
      .on('finish', () => res())
    );
  }

  download(
    stream: WriteStream,
    file: ObjectID | string,
    bucketName: 'image' | 'video' | 'audio' | 'file' = 'file'
  ): WriteStream {
    if (!this.buckets[bucketName]) {
      throw new Error(`bucket ${bucketName} not found`);
    }
    if (file instanceof ObjectID) {
      return this.buckets[bucketName]
        .openDownloadStream(file)
        .pipe(stream);
    } else {
      return this.buckets[bucketName]
        .openDownloadStreamByName(file)
        .pipe(stream);
    }
  }

}
