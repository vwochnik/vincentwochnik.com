---
layout: job
title: Work at Cumulocity
since: 2014
until: 2015
job: Developer Intern
icon: /img/media/cumulocity-icon.png
---
Open, application centric, free to try: The mission of Cumulocity is to make
mobile machine-to-machine applications profitable for all businesses through
ready-made, cloud subscription services.

Using REST-APIs with the JSON data format for communication, mobile data
consumption and costs can grow very rapidly, especially when data is sent
frequently and a large number of devices is employed. Furthermore, many devices
such as the Arduino do not have the capacity to process JSON adequately which
has been a major obstacle in developing the Arduino client for the Cumulocity
platform.

<!--more-->

To solve these problems, SmartREST has been introduced to act as a proxy server
between the client endpoint and the Cumulocity platform, reducing the amount of
data to be sent and removing the necessity to deal with JSON on the client side.

![SmartREST diagram](/img/media/smartrest-diagram.svg)

By storing device-relevant JSON data in a template, data density can be
increased tenfold. The proxy then translates the compact data to the full JSON
which is sent to the platform and vice-versa. On the first connect to the proxy,
the client will send the template and from then on communicate using compact
data.

My involvement in this project spans from the design of the proxy server
architecture to the actual implementation and functional testing, but also
includes the development of a C++ client reference-implementation which runs on
a host of devices ranging from the Arduino to full-fledged server systems.

## Resources

1. [Cumulocity website](http://cumulocity.com/)
1. [C++ client repository](https://bitbucket.org/m2m/cumulocity-clients-c)
   containing the client reference-implementation of SmartREST
2. [Cumulocity at mbed.org](http://mbed.org/users/Cumulocity/code/) with
   SmartREST mbed implementation
