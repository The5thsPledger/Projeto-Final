import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { VeiculoEntity } from '../veiculo/veiculo.entity';

@Entity({ name: 'marcas' })
export class MarcaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome' })
  nome: string;

  @OneToMany(() => VeiculoEntity, (veiculo) => veiculo.marca, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
  })
  veiculos: VeiculoEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
