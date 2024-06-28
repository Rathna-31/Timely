import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString({ each: true })
    image: string[];

    @IsBoolean()
    active: boolean;
}
