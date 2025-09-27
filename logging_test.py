import logging

# Configuração básica do logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Exemplo de mensagens de log em diferentes níveis
logging.debug('Esta é uma mensagem de debug')
logging.info('Esta é uma mensagem de info')
logging.warning('Esta é uma mensagem de warning')
logging.error('Esta é uma mensagem de error')
logging.critical('Esta é uma mensagem de critical')

print('Teste de logging concluído com sucesso!')