FROM python:3.9-slim

WORKDIR /app

RUN pip install setuptools

COPY . /app/

COPY tags.txt /app/

RUN python setup.py install

RUN python -c "import cpppo.server.enip.logix; print('Logix-Modul-Pfad:', cpppo.server.enip.logix.__file__)"

EXPOSE 44818

RUN echo '#!/bin/bash\necho "Starte EtherNet/IP Server mit 400 hochzählenden DINT-Tags..."\npython -m cpppo.server.enip -v -a 0.0.0.0 $(cat /app/tags.txt) --no-print' > /app/start_simulator.sh
RUN chmod +x /app/start_simulator.sh

CMD ["/app/start_simulator.sh"]