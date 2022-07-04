import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const result = await this.repository
    .createQueryBuilder("games")
    .where("games.title ILIKE :title", { title: `%${param}%` })
    .getMany();

    return result;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const result = await this.repository.query("select count(*) from games");

    return result;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("games")
      .relation(Game, "users")
      .of(id)
      .loadMany();
  }
}
