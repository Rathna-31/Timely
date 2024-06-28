import * as csvParser from 'csv-parser';
import * as fs from 'fs';


export const processCSV = async (uid:string, file: Express.Multer.File) => {
    const products = [];
    
    // Read the file
    await new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            console.log(data);
            products.push(data)
        })
        .on('end', () => resolve(products))
        .on('error', (error) => reject(error));
    });

    // Format the data
    const formattedData = products.map((product, index) => {
        // Create variants
        const variants = [];
        for (let i = 1; i <= 3; i++) {
            if(!product[`variant_${i}`]) continue;
            let variant = product[`variant_${i}`].split(';');
            if(variant.length > 3 || variant.length < 2 || variant[1] == undefined || variant[0] == undefined ) {
                throw new Error('Variant field is not valid on line '+index+1);
            }
            console.log(variant);
            variants.push({
                name: variant[0],
                price: variant[1],
                image: variant[2],
            });
        }

        if(product.non_vegeterian == undefined) {
            throw new Error('Non vegetarian field is required on line '+index+1);
        }
        if(product.product_name == undefined) {
            throw new Error('Product name field is required on line '+index+1);
        }
        if(product.category_name == undefined) {
            throw new Error('Category name field is required on line '+index+1);
        }
        
        if(product.stock !== 'InStock' && product.stock !== 'OutOfStock') {
            throw new Error('Stock field is either InStock or OutOfStock on line '+index+1);
        }
        if(product.tax == undefined) {
            throw new Error('Tax field is required on line '+index+1);
        }

        if(product.price == undefined && variants.length == 0) {
            throw new Error('Price field is required on line '+index+1);
        }



        return {
            uid: uid,
            name: product.product_name,
            description: product.description,
            category: product.category_name,
            price: product.price,
            image: product.image,
            stock: product.stock,
            tax: product.tax,
            specialTags: product.special_tags,
            nonVegetarian: product.non_vegeterian.toLowerCase() == 'true' ? true : false,
            variants: variants,
            rating: 0,
            categoryId: "",

        };
    });
    return formattedData;
}