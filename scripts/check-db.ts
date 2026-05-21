import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function safeCount(name: string, fn: () => Promise<number>){
  try{
    const model = (prisma as any)[name];
    if (!model || typeof model.count !== 'function') {
      console.log(name+': model-not-available');
      return null;
    }
    const c = await fn();
    console.log(name+':', c);
    return c;
  } catch(e){ console.error(name+' -> ERROR', e && (e as any).message); return null }
}

async function main(){
  const bc = await prisma.businessConsulting.findMany()
  const hl = await prisma.homeLanding.findMany()
  const pc = await prisma.pageContent.findMany({ take: 5 })

  console.log('businessConsulting sample:', bc.length ? bc[0] : null)
  console.log('homeLanding sample:', hl.length ? hl[0].heroTitle : null)
  console.log('pageContent sample count:', pc.length)

  await safeCount('businessConsulting', ()=>prisma.businessConsulting.count())
  await safeCount('homeLanding', ()=>prisma.homeLanding.count())
  await safeCount('pageContent', ()=>prisma.pageContent.count())
  await safeCount('users', ()=>prisma.user.count())
  await safeCount('courses', ()=>prisma.course.count())
  await safeCount('newsArticles', ()=>prisma.newsArticle.count())
}

main()
  .catch(e=>{ console.error('MAIN ERROR', e); process.exit(1) })
  .finally(()=> (prisma as any)[String.fromCharCode(36)+'disconnect']())
