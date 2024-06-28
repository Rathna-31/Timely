import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
    csv_dest: './upload_csv',
    uploaded_files: './uploaded_files',
};

export const uploadCsvOptions = {
    // Enable file size limits
    limits: {
        fileSize: 10485760,
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(csv)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = multerConfig.csv_dest;

            // Create folder if doesn't exist
            if (!existsSync(uploadPath + '/' + req.user.uid + '/')) {
                mkdirSync(uploadPath + '/' + req.user.uid + '/');
            }
            cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            let filePath = `${req.user.uid}/${'menu'}${extname(file.originalname)}`;
            cb(null, filePath);
        },
    }),
}


export const uploadFileOptions = {
    // Enable file size limits < 20MB
    limits: {
        fileSize: 20971520,
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        console.log(file.mimetype);
        if (file.mimetype.match(/\/(pdf)$/) ||
            file.mimetype.match(/\/(msword)$/) ||
            file.mimetype.match(/\/(vnd.openxmlformats-officedocument.wordprocessingml.document)$/) ||
            file.mimetype.match(/\/(vnd.ms-excel)$/) ||
            file.mimetype.match(/\/(vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/) ||
            file.mimetype.match(/\/(vnd.ms-powerpoint)$/) ||
            file.mimetype.match(/\/(vnd.openxmlformats-officedocument.presentationml.presentation)$/) ||
            file.mimetype.match(/\/(plain)$/) ||
            file.mimetype.match(/\/(rtf)$/) ||
            file.mimetype.match(/\/(csv)$/) ||
            file.mimetype.match(/\/(txt)$/)
        ) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = multerConfig.uploaded_files;
            // Create folder if doesn't exist
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            // let filePath = `${req.user.uid}/${'menu'}${extname(file.originalname)}`;
            cb(null, file.originalname);
        },
    }),
}