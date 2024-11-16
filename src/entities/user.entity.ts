import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { UserRole } from '../user/user.dto';

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

  // Novo campo para definir o papel do usuário
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}
