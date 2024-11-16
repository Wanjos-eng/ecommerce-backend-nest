import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}
