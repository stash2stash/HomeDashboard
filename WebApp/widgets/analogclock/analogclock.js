function AnalogClock(elementId, skinFile) {
   skinFile = typeof skinFile !== 'undefined' ? skinFile : "widgets/analogclock/original.svg";

   return new function() {
      var snap;
      var seconds;
      var timeDelta = 0;
      var description = "";
      var hideSeconds = false;
      var shadowDistance = 1;

      this.SetTimeDelta = function(delta) {
         timeDelta = delta;
         return this;
      }

      this.SetDescription = function(newDescripton) {
         description = newDescripton;
         if(snap) {
            var label = snap.select("#description");
            label.attr({
               text: newDescripton,
            })
         }
         return this;
      }

      this.HideSeconds = function() {
         hideSeconds = true;
         if(seconds) {
            seconds.attr({display: "none"})
         }
         return this;
      }

      this.ShowSeconds = function() {
         hideSeconds = false;
         if(seconds) {
            seconds.attr({display: ""})
         }
         return this;
      }

      this.Run = function() {
         var minutes, hours, rim, face;
         var sshadow, mshadow, hshadow, rshadow, shadows;
         snap = Snap(elementId);
         var easing = function(a) {
               return a == !!a ? a : Math.pow(4, -10 * a) * Math.sin((a - 0.075) * 2 * Math.PI / 0.3) + 1;
         };

         Snap.load(skinFile, function(f) {
            snap.append(f);
            var paper = snap.select("#clock");
            seconds = snap.select("#seconds");
            minutes = snap.select("#minutes");
            hours = snap.select("#hours");
            rim = snap.select("#rim");
            face = {
               elem: snap.select("#face"),
               cx: snap.select("#face").getBBox().cx,
               cy: snap.select("#face").getBBox().cy,
            };

            // If description is not provided, load it from file
            var label = snap.select("#description");
            if(!description) {
               description = label.textContent;
            }
            else {
               label.attr({text: description})
            }

            // Hide seconds hand if required
            if(hideSeconds) {
               seconds.attr({display: "none"})
            }

            sshadow = seconds.clone();
            mshadow = minutes.clone();
            hshadow = hours.clone();
            rshadow = rim.clone();
            shadows = [sshadow, mshadow, hshadow];

            // Insert shadows before their respective opaque pals
            seconds.before(sshadow);
            minutes.before(mshadow);
            hours.before(hshadow);
            rim.before(rshadow);

            // Add the filter, shift and opacity to each of the shadows
            var filter = paper.filter(Snap.filter.blur(0.1) + Snap.filter.brightness(0));
            shadows.forEach(function(el) {
               el.attr({
                  transform: "translate(" + shadowDistance + ", " + shadowDistance + ")",
                  opacity: 0.2,
                  filter: filter
               });
            })

            rshadow.attr({
               transform: "translate(8, 8)",
               opacity: 0.5,
               filter: paper.filter(Snap.filter.blur(8, 8)+Snap.filter.brightness(0)),
            })
            setInterval(update, 1000);
         });


         function update() {
            var time = new Date();
            time.setHours(time.getHours() + timeDelta);
            setHours(time);
            setMinutes(time);
            setSeconds(time);
         }

         function setHours(t) {
            var hour = t.getHours();
            hour %= 12;
            hour += Math.floor(t.getMinutes() / 10) / 6;
            var angle = hour * 360 / 12;
            hours.animate(
               {transform: "rotate("+angle+" "+face.cx+" "+face.cy+")"},
               100,
               mina.linear,
               function() {
                  if (angle === 360) {
                     hours.attr({transform: "rotate("+0+" "+face.cx+" "+face.cy+")"});
                     hshadow.attr({transform: "translate(" + shadowDistance + ", " + shadowDistance + ") rotate("+0+" "+face.cx+" "+face.cy+")"});
                  }
               }
            );
            hshadow.animate(
               {transform: "translate(" + shadowDistance + ", " + shadowDistance + ") rotate("+angle+" "+face.cx+" "+face.cy+")"},
               100,
               mina.linear
            );
         }

         function setMinutes(t) {
            var minute = t.getMinutes();
            minute %= 60;
            minute += Math.floor(t.getSeconds()/10)/6;
            var angle = minute * 360 / 60;
            minutes.animate(
               {transform: "rotate("+angle+" "+face.cx+" "+face.cy+")"},
               100,
               mina.linear,
               function() {
                  if (angle === 360) {
                     minutes.attr({transform: "rotate("+0+" "+face.cx+" "+face.cy+")"});
                     mshadow.attr({transform: "translate(" + shadowDistance + ", " + shadowDistance + ") rotate("+0+" "+face.cx+" "+face.cy+")"});
                  }
               }
            );
            mshadow.animate(
               {transform: "translate(" + shadowDistance + ", " + shadowDistance + ") rotate("+angle+" "+face.cx+" "+face.cy+")"},
               100,
               mina.linear
            );
         }

         function setSeconds(t) {
            t = t.getSeconds();
            t %= 60;
            var angle = t * 360 / 60;
            // If ticking over to 0 seconds, animate angle to 360 and then switch angle to 0
            if (angle === 0) angle = 360;
            sshadow.animate(
               {transform: "translate(" + shadowDistance + ", " + shadowDistance + ") rotate("+angle+" "+face.cx+" "+face.cy+")"},
               600,
               easing,
               function() {
                  if (angle === 360) {
                     sshadow.attr({transform: "translate(" + shadowDistance + ", " + shadowDistance + ") rotate("+0+" "+face.cx+" "+face.cy+")"});
                  }
               }
            );
            seconds.animate(
               {transform: "rotate("+angle+" "+face.cx+" "+face.cy+")"},
               600,
               easing,
               function() {
                  if (angle === 360) {
                     seconds.attr({transform: "rotate("+0+" "+face.cx+" "+face.cy+")"});
                  }
               }
            );
         }
         return this;
      };
   };
};
