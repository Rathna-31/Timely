import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadCsvOptions, uploadFileOptions } from './document.config';
import { DocumentService } from './document.service';
import { ProductService } from 'src/products/products.service';
import { processCSV } from '../utils/index';
import { CategoryService } from 'src/category/category.service';
import { Product } from 'src/products/products.schema';
import { unlink } from 'fs';
import { get } from 'http';


@Controller('document')
export class DocumentController {

    constructor(private readonly documentService: DocumentService,
        @Inject(ProductService) private readonly productService: ProductService,
        @Inject(CategoryService) private readonly categoryService: CategoryService) { }

    // @Post('upload_csv')
    // @UseInterceptors(FileInterceptor('file', uploadCsvOptions))
    // async uploadCSV(@UploadedFile() file: Express.Multer.File, @Req() request: any, @Res({ passthrough: true }) response: any) {
    //     try {
    //         // Handle the document upload logic
    //         console.log(request.user);
    //         const uid = request.user.uid;
    //         const documentDetails = {
    //             mimetype: file.mimetype,
    //             size: file.size,
    //             filename: file.filename,
    //             filepath: file.path,
    //             created_at: new Date(),
    //             uid: uid,
    //         };
    //         await this.documentService.create(documentDetails);
    //         const formattedData = await processCSV(uid, file);


    //         //Find category id and create if not exists
    //         const products: Product[] = [];

    //         for (const product of formattedData) {
    //             const category: any = await this.categoryService.findCategoryByName(uid, product.category);
    //             console.log(category);
    //             let categoryId = category !== null ? category._id : '';

    //             if (category == null) {
    //                 const categoryData = {
    //                     uid: uid,
    //                     name: product.category,
    //                     description: "",
    //                     image: "",
    //                     active: true,
    //                     created_at: new Date(),
    //                 };
    //                 const category2: any = await this.categoryService.create(categoryData);
    //                 console.log(category2);
    //                 console.log(categoryData);
    //                 categoryId = category2._id;
    //             }

    //             Object.assign(product, { categoryId: categoryId });
    //             delete product.category;
    //             products.push(product);
    //         }

    //         console.log(products);

    //         await this.productService.createProducts(products);
    //         return products;
    //     } catch (error) {
    //         console.log("error > ", error);
    //         throw new BadRequestException(error.message);
    //     }
    // };

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', uploadFileOptions))
    async uploadPDF(@UploadedFile() file: Express.Multer.File, @Req() request: any) {
        // Handle the document upload logic
        console.log(request);
        const uid = request.user.uid;
        const documentDetails = {
            mimetype: file.mimetype,
            size: file.size,
            filename: file.filename,
            filepath: file.path,
            created_at: new Date(),
            uid: uid,
        };

        return await this.documentService.create(documentDetails);
    }

    @Post('process_embeddings')
    async processEmbeddings(@Req() request: any) {
        return await this.documentService.processEmbeddings();
    }

    @Get('query')
    async query(@Query('question') question: any) {
        return await this.documentService.queryEmbeddings(question);
    }

    @Get()
    async findAll(@Req() request: any) {
        const uid = request.user.uid;
        return await this.documentService.findAll(uid);
    }

    @Get('/list_uploaded_files')
    async listUploadedFiles(@Req() request: any) {
        return await this.documentService.listUploadedFiles();
    }


    @Delete(':fileName')
    async delete(@Param('fileName') fileName: string, @Req() request: any) {
        try {
            return await this.documentService.deleteFile(fileName);
        } catch (error) {
            console.error('An error occurred while deleting the file:', error);
            throw new Error('Failed to delete file');
        }
    }

}
