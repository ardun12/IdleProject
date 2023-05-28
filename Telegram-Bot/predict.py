import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from tensorflow.compat.v1 import disable_eager_execution
from tensorflow.keras.utils import disable_interactive_logging
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer

disable_eager_execution()
disable_interactive_logging()

model = load_model('model')

tokenizer = Tokenizer(num_words=10000, filters='\[[^\]]+\]|\w|\d\!"#$%&()*+,-–—./:;<=>?@[\]^_`{|}~\t\n\xa0\_x000D_', lower=True, split=' ', oov_token='unknown', char_level=False)

max_sequence_length = 194

params = ['Духовное', 'Местное_пиво', 'Релакс', 'театр', 'Приключения_и_экстрим', 'Пляж', 'Ночные_клубы', 'В_поисках_чудес', 'Исследовательское', 'Романтическое', 'Исследовательское,', 'Музеи', 'Люкс', 'Экстремальное', 'Глухомань', 'Вина', 'Экологичное_потребление', 'Искусство_и_', 'Быстрый_темп', 'Шоппинг', 'Коренные_народы_и_традиции', 'Спортивные_события', 'Увидеть_достопримечательности', 'Местная_культура', 'Сафари', 'История', 'Наука']


async def classify_text(text: str) -> list[str]:
    tokenizer.fit_on_texts(text)
    text_tokens = tokenizer.texts_to_sequences([text])
    text_indexes = pad_sequences(text_tokens, maxlen=max_sequence_length)
    
    predictions = model.predict(text_indexes)
    predicted_labels = [params[i] for i, prediction in enumerate(predictions[0]) if prediction >= 0.5]
    
    return predicted_labels
