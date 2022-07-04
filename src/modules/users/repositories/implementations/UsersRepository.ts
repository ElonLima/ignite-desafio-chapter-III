import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      relations: ['games'],
      where: {
        id: user_id,
      }
    })

    if (!user) throw new Error('');

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const result = await this.repository.query("select * from users order by first_name asc");

    return result;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query("SELECT * FROM users WHERE first_name ILIKE $1 AND last_name ILIKE $2", [first_name, last_name]);
  }
}
