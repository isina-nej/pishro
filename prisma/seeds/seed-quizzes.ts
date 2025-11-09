/**
 * Seed Quizzes and Questions
 * Creates quiz records with questions for courses
 */

import { PrismaClient, QuestionType } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const QUIZ_PER_COURSE = 2; // Average quizzes per course
const QUESTIONS_PER_QUIZ = 10; // Questions per quiz

export async function seedQuizzes() {
  console.log('🌱 Starting to seed quizzes and questions...');

  try {
    const courses = await prisma.course.findMany();

    if (courses.length === 0) {
      console.log('⚠️  Please seed courses first!');
      return { created: 0, updated: 0, total: 0 };
    }

    let quizCount = 0;
    let questionCount = 0;

    for (const course of courses) {
      const numQuizzes = generator.randomInt(1, QUIZ_PER_COURSE + 1);

      for (let q = 0; q < numQuizzes; q++) {
        const quiz = await prisma.quiz.create({
          data: {
            title: `آزمون ${q + 1} - ${course.subject}`,
            description: `ارزیابی میزان یادگیری شما در ${course.subject}`,
            courseId: course.id,
            timeLimit: generator.choice([null, 15, 20, 30, 45, 60]),
            passingScore: generator.choice([60, 70, 75, 80]),
            maxAttempts: generator.choice([null, 3, 5, 10]),
            shuffleQuestions: generator.choice([true, false]),
            shuffleAnswers: generator.choice([true, false]),
            showResults: true,
            showCorrectAnswers: generator.choice([true, false]),
            published: generator.choice([true, true, false]),
            order: q
          }
        });

        quizCount++;

        // Create questions for this quiz
        for (let i = 0; i < QUESTIONS_PER_QUIZ; i++) {
          const questionType = generator.choice([
            QuestionType.MULTIPLE_CHOICE,
            QuestionType.MULTIPLE_CHOICE,
            QuestionType.MULTIPLE_CHOICE,
            QuestionType.TRUE_FALSE,
            QuestionType.MULTIPLE_SELECT
          ]);

          let questionData: any = {
            quizId: quiz.id,
            question: generator.choice([
              'کدام گزینه تعریف صحیح تحلیل تکنیکال است؟',
              'بهترین زمان برای خرید سهام در چه شرایطی است؟',
              'مدیریت ریسک چه اهمیتی در معامله‌گری دارد؟',
              'کدام اندیکاتور برای شناسایی روند مناسب‌تر است؟',
              'الگوی سر و شانه چه سیگنالی را نشان می‌دهد؟'
            ]),
            questionType,
            explanation: 'توضیحات مربوط به پاسخ صحیح و دلیل انتخاب آن.',
            points: generator.choice([1, 1, 1, 2, 3]),
            order: i
          };

          if (questionType === QuestionType.MULTIPLE_CHOICE || questionType === QuestionType.MULTIPLE_SELECT) {
            const numOptions = generator.randomInt(3, 5);
            const correctIndex = generator.randomInt(0, numOptions);
            const options = [];

            for (let o = 0; o < numOptions; o++) {
              options.push({
                text: `گزینه ${o + 1}`,
                isCorrect: questionType === QuestionType.MULTIPLE_CHOICE ? o === correctIndex : generator.choice([true, false])
              });
            }

            questionData.options = JSON.stringify(options);
          } else if (questionType === QuestionType.TRUE_FALSE) {
            questionData.correctAnswer = generator.choice([true, false]);
            questionData.options = JSON.stringify([
              { text: 'صحیح', isCorrect: questionData.correctAnswer },
              { text: 'غلط', isCorrect: !questionData.correctAnswer }
            ]);
          }

          await prisma.quizQuestion.create({ data: questionData });
          questionCount++;
        }
      }

      if (quizCount % 10 === 0) {
        console.log(`  ✓ Created ${quizCount} quizzes with ${questionCount} questions...`);
      }
    }

    console.log(`\n✅ Quizzes and questions seeded successfully!`);
    console.log(`   📝 Quizzes: ${quizCount}`);
    console.log(`   📝 Questions: ${questionCount}`);

    return { created: quizCount + questionCount, updated: 0, total: quizCount + questionCount };
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    throw error;
  }
}

if (require.main === module) {
  seedQuizzes()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
