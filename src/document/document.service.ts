import { Injectable } from '@nestjs/common';
import { Client, Environment } from 'square';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadedDocumentDocument } from './document.schema';
import { UnstructuredDirectoryLoader } from "langchain/document_loaders/fs/unstructured";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";


import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

import { QdrantVectorStore } from "langchain/vectorstores/qdrant";


import * as fs from 'fs';
import { filesize } from "filesize";



const loader = new UnstructuredDirectoryLoader(
  "uploaded_files",
  {
    apiKey: "L2Dm2m0USOK239Bja9dcErmiMoPEvE"
  }
);


const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 20,
});

@Injectable()
export class DocumentService {

  private model;
  private template;


  constructor(@InjectModel('Document') private readonly uploadDocumentModel: Model<UploadedDocumentDocument>,
    private readonly configService: ConfigService) {
    this.model = new ChatOpenAI({ temperature: 0, modelName: "gpt-4", openAIApiKey: this.configService.get('OPENAI_API_KEY') });
    this.template = `Use the following pieces of context to answer the question at the end. 
    Do not answer the question if it is not related to the context.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Use four sentences maximum and keep the answer as concise as possible.
    Always say "thanks for asking!" at the end of the answer.

    {context}
    
    Question: {question}
    
    Helpful Answer:`;
  }





  async create(doc) {
    console.log('document', doc);
    const document = new this.uploadDocumentModel(doc);
    return document.save();
  }

  async processEmbeddings() {
    console.log("Recieved request to Process embeddings");
    console.log('Loading and Splitting Documents');
    const data = await loader.load();
    const docsOutput = await splitter.splitDocuments(data);
    console.log("\n\n\n Document Output After Splitting" , docsOutput);


    console.log('Processing Embeddings');
    const vectorStore = await QdrantVectorStore.fromDocuments(
      docsOutput,
      new OpenAIEmbeddings({ openAIApiKey: this.configService.get('OPENAI_API_KEY') }), {
      collectionName: this.configService.get('VECTOR_COLLECTION_NAME'),
      url: this.configService.get('QDRANT_URL'),
      apiKey: this.configService.get('QDRANT_CLUSTER_API_KEY')
    });

    console.log('Done Processing Embeddings');
    // const response = await vectorStore.similaritySearch("Kocha", 5);

    // console.log(response);

    return "Done Processing Embeddings";
  }

  async queryEmbeddings(query) {
    console.log("Answering question for: ", query);

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      new OpenAIEmbeddings({ openAIApiKey: this.configService.get('OPENAI_API_KEY') }),
      {
        collectionName: this.configService.get('VECTOR_COLLECTION_NAME'),
        url: this.configService.get('QDRANT_URL'),
        apiKey: this.configService.get('QDRANT_CLUSTER_API_KEY')
      }
    );

    // const docs = await vectorStore.similaritySearch('Kocha', 5);

    // console.log(docs);

    const chain = RetrievalQAChain.fromLLM(this.model, vectorStore.asRetriever(), {
      prompt: PromptTemplate.fromTemplate(this.template),
    });

    const response = await chain.call({
      query: query,
    });

    console.log(response);

    return response;
  }

  async listUploadedFiles() {

    let response = [];

    let files = await fs.readdirSync('uploaded_files');

    files.forEach((file, index) => {
      let fileData = {};
      fileData['fileName'] = file;
      fileData['fileSize'] = filesize(fs.statSync(`uploaded_files/${file}`).size, { base: 2, standard: "jedec" });
      fileData['fileType'] = file.split('.')[1];
      fileData['fileCreatedDate'] = fs.statSync(`uploaded_files/${file}`).birthtime;
      fileData['fileModifiedDate'] = fs.statSync(`uploaded_files/${file}`).mtime;
      fileData['fileAccessedDate'] = fs.statSync(`uploaded_files/${file}`).atime;

      response.push(fileData);

      // console.log(fs.fstatSync(fs.openSync(`uploaded_files/${file}`, 'r')));
    });

    console.log(response);
    return response;
  }

  async deleteFile(fileName) {
    try {
      fs.unlinkSync(`uploaded_files/${fileName}`);
      console.log('File deleted successfully');
      return 'File deleted successfully';
    } catch (error) {
      console.log('Error while deleting file', error);
      throw new Error('Failed to delete file');
    }
  }


  async findAll(uid: string) {
    return this.uploadDocumentModel.find({ uid: uid }).exec();
  }
}
