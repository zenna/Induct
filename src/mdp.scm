(define mdp-solve
  (lambda (type states actions transitions rewards discount)
    (cond ((equal? type "value-iteration")

           )
          )
    )
  )

(define update-V
  (lambda (V states actions transitions rewards discount)
    (map
     (lambda (state)
       (sum (
             (map (lambda (x) (+
                               (* discount
                                        (list-ref V state)
                                        
                                     )
                               x)
                          )

                  (multiply transitions rewards)
                  )
             )
            )

       )
     states
     )
    )
  )

(define transitions
  (lambda (s a)
    (if (or
         (= 0 (- s a)) (= (+ s a) 11)
         )
        0
        1
        )
    )
  )

(define multiply
  (lambda (l1 l2)
    (map * l1 l2)
    )
  )

(define arg-max
  (lambda (express args)
    (max-args
     (max-val (values express args)) (values express args) 0
     )
    )
  )

(define max-in-list ;;find max element in list
  (lambda (ls)
    (let ( (head (car ls)) (tail (cdr ls)))
      (if (null? tail)
          head
          (let ((max-in-tail (max-in-list tail)))
            (if (> head max-in-tail)
                head
                max-in-tail
                )
            )
          )
      )
    )
  )

(define max-val (lambda (vals)
                  (max-in-list vals)
                  )
  )

(define max-args
  (lambda (val vals n)
    (if (equal? val (car vals))
        n
        (max-args val (cdr vals) (+ n 1)
                  )
        )
    )
  )

)
(define values
  (lambda (express args)

    (map express args)

    )
  )
