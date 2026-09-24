export default async function handler(req, res) {
    // Получаем путь к картинке из запроса
    const { path } = req.query;
    if (!path) return res.status(400).send('Нет пути к файлу');

    // Берем секретный токен бота из настроек Vercel
    const token = process.env.BOT_TOKEN;
    // Собираем правильную ссылку для скачивания файла из Телеграма
    const url = `https://api.telegram.org/file/bot${token}/${path}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка загрузки из Telegram');

        // Превращаем ответ в картинку
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Отправляем картинку в браузер
        res.setHeader('Content-Type', 'image/jpeg');
        // Кэшируем картинку на час, чтобы она грузилась моментально при повторном открытии
        res.setHeader('Cache-Control', 's-maxage=3600');
        res.status(200).send(buffer);
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
}

