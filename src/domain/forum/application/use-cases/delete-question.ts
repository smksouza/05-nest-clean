import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeleteQuestionsUseCaseRequest {
  authorId: string
  questionId: string
}

type DeleteQuestionsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({
    authorId,
    questionId,
  }: DeleteQuestionsUseCaseRequest): Promise<DeleteQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findById(questionId)

    if (!questions) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== questions.authorId.toString()) {
      return left(new NotAllowedError())
    }
    await this.questionsRepository.delete(questions)

    return right(null)
  }
}
