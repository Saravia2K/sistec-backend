import { PartialType } from '@nestjs/swagger';
import { CreateComponentStockDto } from './create-component-stock.dto';

export class UpdateComponentStockDto extends PartialType(CreateComponentStockDto) {}
