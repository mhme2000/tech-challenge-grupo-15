import {
  Controller,
  Get,
  Param,
  Inject,
  ParseUUIDPipe,
  Res,
  HttpStatus,
  Delete,
  Put,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ICreateProductApplication } from 'src/core/Product/application/interfaces/createProduct.interface';
import { IDeleteProductByIdApplication } from 'src/core/Product/application/interfaces/deleteProductById.interface';
import { IGetAllProductsApplication } from 'src/core/Product/application/interfaces/getAllProducts.interface';
import { IGetProductByCategoryIdApplication } from 'src/core/Product/application/interfaces/getProductByCategoryId.interface';
import { IGetProductByIdApplication } from 'src/core/Product/application/interfaces/getProductById.interface';
import { IUpdateProductByIdApplication } from 'src/core/Product/application/interfaces/updateProductById.interface';
import { AddOrUpdateProductDto } from 'src/core/Product/domain/dtos/addOrUpdateProductDto';
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    @Inject('IGetProductByIdApplication')
    private getProductByIdApp: IGetProductByIdApplication,
    @Inject('IGetProductByCategoryIdApplication')
    private getProductByCategoryIdApp: IGetProductByCategoryIdApplication,
    @Inject('IGetAllProductsApplication')
    private getAllProductsApp: IGetAllProductsApplication,
    @Inject('IDeleteProductByIdApplication')
    private deleteProductByIdApp: IDeleteProductByIdApplication,
    @Inject('IUpdateProductByIdApplication')
    private updateProductByIdApp: IUpdateProductByIdApplication,
    @Inject('ICreateProductApplication')
    private createProductApp: ICreateProductApplication,
  ) { }

  @Get('/:id')
  public async GetById(
    @Res() res,
    @Param('id', new ParseUUIDPipe({ version: '4' })) productId: string,
  ) {
    try {
      const product = await this.getProductByIdApp.getProductById(productId);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: product,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: err,
      });
    }
  }

  @Get()
  public async Get(@Res() res) {
    try {
      const products = await this.getAllProductsApp.getAllProducts();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: products,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: err,
      });
    }
  }

  @Get('filterByCategoryId/:categoryId')
  public async GetByCategoryId(
    @Res() res,
    @Param('categoryId', new ParseUUIDPipe({ version: '4' })) categoryId: string,
  ) {
    try {
      const products = await this.getProductByCategoryIdApp.getProductByCategoryId(categoryId);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: products,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: err,
      });
    }
  }


  @Delete('/:id')
  public async Delete(
    @Res() res,
    @Param('id', new ParseUUIDPipe({ version: '4' })) productId: string,
  ) {
    try {
      await this.deleteProductByIdApp.deleteProductById(productId);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: null,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: err,
      });
    }
  }

  @Put('/:id')
  public async Update(
    @Res() res,
    @Param('id', new ParseUUIDPipe({ version: '4' })) productId: string,
    @Body() productDto: AddOrUpdateProductDto,
  ) {
    try {
      productDto.productId = productId;
      const product = await this.updateProductByIdApp.updateProductById(
        productDto,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: product,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: err,
      });
    }
  }

  @Post()
  public async Create(@Res() res, @Body() productDto: AddOrUpdateProductDto) {
    try {
      const product = await this.createProductApp.createProduct(productDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: product,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: err,
      });
    }
  }
}